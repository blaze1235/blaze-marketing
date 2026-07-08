/* BlazeRent Studio — app.js
 * Shell: shared UI helpers, navigation, dashboard, library, settings, onboarding.
 * Loaded last; initializes every studio.
 */
window.BR = window.BR || {};

(function () {
  const $ = id => document.getElementById(id);

  /* =====================================================================
   * Shared UI helpers
   * ===================================================================== */
  let toastTimer = null;
  function toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.add('hidden'), 2600);
  }

  /** Build a chip radio-group. Returns {get, set}. */
  function chips(container, options, selected, onChange) {
    container.innerHTML = '';
    let value = selected;
    const els = options.map(opt => {
      const el = document.createElement('span');
      el.className = 'chip' + (opt.value === value ? ' active' : '');
      el.textContent = opt.label;
      el.addEventListener('click', () => {
        value = opt.value;
        els.forEach(e2 => e2.classList.remove('active'));
        el.classList.add('active');
        onChange && onChange(value);
      });
      container.appendChild(el);
      return el;
    });
    return {
      get: () => value,
      set: v => {
        value = v;
        els.forEach((el, i) => el.classList.toggle('active', options[i].value === v));
      }
    };
  }

  /** Read a file as a (downscaled) dataURL, keeping localStorage happy. */
  function fileToDataURL(file, maxDim = 1600) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
          if (scale === 1 && file.type !== 'image/heic') return resolve(reader.result);
          const c = document.createElement('canvas');
          c.width = Math.round(img.width * scale);
          c.height = Math.round(img.height * scale);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          resolve(c.toDataURL('image/jpeg', 0.88));
        };
        img.onerror = () => resolve(null);
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function copy(text) {
    navigator.clipboard.writeText(text)
      .then(() => toast('⿻ Copied — paste it into Instagram'))
      .catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        toast('⿻ Copied');
      });
  }

  /** Shared "edit slide text" modal. */
  let editTarget = null, editCallback = null;
  function editSlide(slide, onApply) {
    editTarget = slide;
    editCallback = onApply;
    $('emBadge').value = slide.badge || '';
    $('emTitle').value = slide.title || '';
    $('emBody').value = slide.body || '';
    $('editModal').classList.remove('hidden');
  }

  BR.ui = { toast, chips, fileToDataURL, copy, editSlide };

  /* =====================================================================
   * Navigation
   * ===================================================================== */
  function goto(view) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
    document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + view));
    if (view === 'library') renderLibrary();
    if (view === 'dashboard') renderDashboard();
    if (view === 'settings') fillSettings();
  }

  /* =====================================================================
   * Dashboard
   * ===================================================================== */
  let currentIdea = null;

  function renderDashboard() {
    const b = BR.store.brand;
    const s = BR.store.state;
    $('dashGreeting').textContent = `Let's make something for ${b.name} 🔥`;
    $('dashDate').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    if (!currentIdea) shuffleIdea();
    $('statPosts').textContent = s.library.length;
    $('statLikes').textContent = s.taste.likes;
    $('statPlanned').textContent = s.planner.filter(i => i.status !== 'posted').length;
    $('statStreak').textContent = b.designStyle;

    const planWrap = $('dashPlan');
    const next = s.planner.filter(i => i.status !== 'posted').slice(0, 3);
    planWrap.innerHTML = next.length
      ? next.map(i => `<div class="plan-mini"><span class="plan-type">${i.type}</span> <span>${escapeHtml(i.title)}</span></div>`).join('')
      : '<p class="muted">Nothing planned. Open the Planner and generate your week ⚡</p>';
  }

  function shuffleIdea() {
    currentIdea = BR.content.randomIdea();
    $('dashIdea').textContent = `${{ post: '▣', carousel: '⧉', reel: '▷' }[currentIdea.type]} ${currentIdea.text}`;
  }

  function escapeHtml(s) {
    const d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  /* =====================================================================
   * Library
   * ===================================================================== */
  function renderLibrary() {
    const list = $('libList');
    const items = BR.store.state.library;
    list.innerHTML = '';
    if (!items.length) {
      list.innerHTML = '<div class="empty-note">Nothing saved yet. Generate something you love in a studio and hit ♥ Save.</div>';
      return;
    }
    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'lib-item';
      el.innerHTML = `
        <div class="lib-kind">${item.kind}</div>
        <h4>${escapeHtml(item.title)}</h4>
        <p>${escapeHtml((item.caption || '').slice(0, 140))}</p>
        <div class="row gap">
          <button class="btn small" data-act="open">↗ Open</button>
          <button class="btn small ghost" data-act="copy">⿻ Caption</button>
          <button class="btn small ghost danger" data-act="del">✕</button>
        </div>`;
      el.querySelector('[data-act=open]').addEventListener('click', () => {
        if (item.kind === 'post') { BR.post.load(item); goto('post'); }
        else if (item.kind === 'carousel') { BR.carousel.load(item); goto('carousel'); }
        else if (item.kind === 'reel') { BR.reel.load(item); goto('reel'); }
      });
      el.querySelector('[data-act=copy]').addEventListener('click', () => copy(item.caption || ''));
      el.querySelector('[data-act=del]').addEventListener('click', () => {
        BR.store.removeFromLibrary(item.id);
        renderLibrary();
      });
      list.appendChild(el);
    });
  }

  /* =====================================================================
   * Settings / brand editor
   * ===================================================================== */
  let setChips = {};
  let settingsBuilt = false;

  function buildSettings() {
    if (settingsBuilt) return;
    settingsBuilt = true;
    const b = BR.store.brand;
    setChips.font = chips($('setFontChips'), [
      { value: 'bold', label: 'Heavy Sans' }, { value: 'clean', label: 'Clean Sans' },
      { value: 'serif', label: 'Serif' }, { value: 'mono', label: 'Mono' }
    ], b.font, () => previewBrand());
    setChips.style = chips($('setStyleChips'), [
      { value: 'gradient', label: '🌅 Gradient' }, { value: 'dark', label: '🌑 Dark' },
      { value: 'light', label: '☀️ Light' }, { value: 'solid', label: '🎨 Solid' }
    ], b.designStyle, () => previewBrand());
    setChips.lang = chips($('setLangChips'), BR.content.LANGS.map(l => ({ value: l, label: BR.content.LANG_LABELS[l] })), b.lang);
    setChips.tone = chips($('setToneChips'), BR.content.TONES.map(t => ({ value: t, label: BR.content.TONE_LABELS[t] })), b.tone);

    $('setEmoji').addEventListener('input', () => {
      $('setEmojiLabel').textContent = ['No emoji', 'Minimal', 'Moderate 👍', 'Maximum 🔥🔥'][+$('setEmoji').value];
    });
    ['setColPrimary', 'setColDark', 'setColAccent', 'setColLight'].forEach(id =>
      $(id).addEventListener('input', () => previewBrand()));

    $('setLogo').addEventListener('change', async e => {
      const file = e.target.files[0];
      if (!file) return;
      BR.store.brand.logo = await fileToDataURL(file, 256);
      BR.store.save();
      updateSidebar();
      previewBrand();
      toast('Logo saved ✓');
    });
    $('setLogoClear').addEventListener('click', () => {
      BR.store.brand.logo = null;
      BR.store.save();
      updateSidebar();
      previewBrand();
    });

    $('setSave').addEventListener('click', saveSettings);
    $('tasteReset').addEventListener('click', () => {
      if (!confirm('Forget everything I learned about your taste?')) return;
      BR.store.resetTaste();
      updateSidebar();
      fillSettings();
      toast('Taste memory reset');
    });
    $('dataExport').addEventListener('click', () => {
      const blob = new Blob([BR.store.exportAll()], { type: 'application/json' });
      BR.zip.downloadBlob(blob, 'blazerent-studio-backup.json');
    });
    $('dataImportBtn').addEventListener('click', () => $('dataImport').click());
    $('dataImport').addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          BR.store.importAll(reader.result);
          toast('Data imported — reloading');
          setTimeout(() => location.reload(), 800);
        } catch (err) {
          toast('Import failed: not a valid backup file');
        }
      };
      reader.readAsText(file);
    });
  }

  function fillSettings() {
    buildSettings();
    const b = BR.store.brand;
    $('setName').value = b.name;
    $('setNiche').value = b.niche;
    $('setTagline').value = b.tagline;
    $('setCity').value = b.city;
    $('setHandle').value = b.handle;
    $('setPhone').value = b.phone;
    $('setColPrimary').value = b.colors.primary;
    $('setColDark').value = b.colors.dark;
    $('setColAccent').value = b.colors.accent;
    $('setColLight').value = b.colors.light;
    setChips.font.set(b.font);
    setChips.style.set(b.designStyle);
    setChips.lang.set(b.lang);
    setChips.tone.set(b.tone);
    $('setEmoji').value = b.emoji;
    $('setEmojiLabel').textContent = ['No emoji', 'Minimal', 'Moderate 👍', 'Maximum 🔥🔥'][b.emoji];
    $('setHashtags').value = b.hashtags;
    $('setApiKey').value = BR.store.state.settings.apiKey || '';
    const signals = BR.store.tasteSignals();
    $('tasteSummary').textContent = signals
      ? `I've learned from ${BR.store.state.taste.likes} likes and ${BR.store.state.taste.dislikes} dislikes. Your favorites get generated more often.`
      : 'No signals yet — like or dislike generated content and I\'ll adapt to you.';
    previewBrand();
  }

  function saveSettings() {
    const b = BR.store.brand;
    b.name = $('setName').value.trim() || 'BlazeRent';
    b.niche = $('setNiche').value;
    b.tagline = $('setTagline').value.trim();
    b.city = $('setCity').value.trim();
    b.handle = $('setHandle').value.trim();
    b.phone = $('setPhone').value.trim();
    b.colors.primary = $('setColPrimary').value;
    b.colors.dark = $('setColDark').value;
    b.colors.accent = $('setColAccent').value;
    b.colors.light = $('setColLight').value;
    b.font = setChips.font.get();
    b.designStyle = setChips.style.get();
    b.lang = setChips.lang.get();
    b.tone = setChips.tone.get();
    b.emoji = +$('setEmoji').value;
    b.hashtags = $('setHashtags').value.trim();
    BR.store.state.settings.apiKey = $('setApiKey').value.trim();
    BR.store.save();
    updateSidebar();
    toast('💾 Brand saved — every studio now uses it');
  }

  // live sample slide in the settings page (uses the *unsaved* form values)
  async function previewBrand() {
    const b = BR.store.brand;
    const backup = JSON.stringify({ colors: b.colors, font: b.font, designStyle: b.designStyle });
    b.colors.primary = $('setColPrimary').value || b.colors.primary;
    b.colors.dark = $('setColDark').value || b.colors.dark;
    b.colors.accent = $('setColAccent').value || b.colors.accent;
    b.colors.light = $('setColLight').value || b.colors.light;
    if (setChips.font) b.font = setChips.font.get();
    if (setChips.style) b.designStyle = setChips.style.get();
    await BR.canvas.renderSlide($('setPreviewCanvas'), {
      layout: 'cover', badge: 'PREVIEW',
      title: 'This is how your posts will look',
      body: 'Colors, font and style — applied everywhere automatically.',
      pageNum: 1, pageCount: 5, swipe: true
    }, { w: 1080, h: 1350 });
    const saved = JSON.parse(backup);
    Object.assign(b.colors, saved.colors);
    b.font = saved.font;
    b.designStyle = saved.designStyle;
  }

  /* =====================================================================
   * Sidebar
   * ===================================================================== */
  function updateSidebar() {
    const b = BR.store.brand;
    $('sideBrandName').textContent = b.name;
    const logoEl = $('sideLogo');
    if (b.logo) logoEl.innerHTML = `<img src="${b.logo}" alt="">`;
    else logoEl.textContent = '🔥';
    const signals = BR.store.tasteSignals();
    $('tasteMeterFill').style.width = Math.min(100, signals * 4) + '%';
    $('tasteMeterText').textContent = signals
      ? `${signals} signal${signals === 1 ? '' : 's'} learned`
      : 'Like 👍 / dislike 👎 to teach me';
  }

  /* =====================================================================
   * Onboarding
   * ===================================================================== */
  function maybeOnboard() {
    if (BR.store.state.onboarded) return;
    const ob = $('onboarding');
    ob.classList.remove('hidden');
    const styleChips = chips($('obStyleChips'), [
      { value: 'gradient', label: '🌅 Gradient' }, { value: 'dark', label: '🌑 Dark' },
      { value: 'light', label: '☀️ Light' }, { value: 'solid', label: '🎨 Solid' }
    ], 'gradient');
    const toneChips = chips($('obToneChips'), BR.content.TONES.map(t => ({ value: t, label: BR.content.TONE_LABELS[t] })), 'bold');
    const langChips = chips($('obLangChips'), [
      { value: 'en', label: 'English' }, { value: 'ru', label: 'Русский' }, { value: 'uz', label: 'O\'zbekcha' }
    ], 'en');

    $('obNext1').addEventListener('click', () => {
      $('obStep1').classList.add('hidden');
      $('obStep2').classList.remove('hidden');
    });
    $('obFinish').addEventListener('click', () => {
      const b = BR.store.brand;
      b.name = $('obName').value.trim() || 'BlazeRent';
      b.niche = $('obNiche').value;
      b.city = $('obCity').value.trim();
      b.handle = $('obHandle').value.trim() || '@' + b.name.toLowerCase().replace(/\s+/g, '');
      b.colors.primary = $('obColor').value;
      b.designStyle = styleChips.get();
      b.tone = toneChips.get();
      b.lang = langChips.get();
      BR.store.state.onboarded = true;
      BR.store.save();
      // studios were initialized with defaults — reload so they pick up the brand
      location.reload();
    });
  }

  /* =====================================================================
   * Boot
   * ===================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    // navigation
    document.querySelectorAll('.nav-btn').forEach(b =>
      b.addEventListener('click', () => goto(b.dataset.view)));
    document.querySelectorAll('.dash-action').forEach(el =>
      el.addEventListener('click', () => goto(el.dataset.goto)));

    // dashboard idea
    $('dashIdeaShuffle').addEventListener('click', shuffleIdea);
    $('dashIdeaUse').addEventListener('click', () => {
      if (currentIdea) goto(currentIdea.type);
    });

    // edit-slide modal
    $('emApply').addEventListener('click', () => {
      if (editTarget) {
        editTarget.badge = $('emBadge').value;
        editTarget.title = $('emTitle').value;
        editTarget.body = $('emBody').value;
        editCallback && editCallback();
      }
      $('editModal').classList.add('hidden');
    });
    $('emCancel').addEventListener('click', () => $('editModal').classList.add('hidden'));

    // studios
    BR.post.init();
    BR.carousel.init();
    BR.reel.init();
    BR.planner.init();

    updateSidebar();
    renderDashboard();
    maybeOnboard();

    document.addEventListener('br:statechange', updateSidebar);
  });
})();
