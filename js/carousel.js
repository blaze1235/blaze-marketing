/* BlazeRent Studio — carousel.js
 * Carousel Studio: ready-made packs, custom points, or AI — exported
 * as a ZIP of 1080x1350 PNG slides + a ready caption.
 */
window.BR = window.BR || {};

(function () {
  const $ = id => document.getElementById(id);
  const STYLES = [null, 'gradient', 'dark', 'light', 'solid'];
  const W = 1080, H = 1350;

  const cur = {
    source: 'pack', lang: 'en',
    slides: [], caption: '', ids: [], title: '',
    idx: 0, styleIdx: 0
  };

  function init() {
    const b = BR.store.brand;
    cur.lang = BR.store.recall('carousel', 'lang', b.lang);
    cur.source = BR.store.recall('carousel', 'source', 'pack');

    BR.ui.chips($('carSourceChips'), [
      { value: 'pack', label: '📦 Ready-made' },
      { value: 'custom', label: '✏️ My points' },
      { value: 'ai', label: '✨ AI topic' }
    ], cur.source, v => { cur.source = v; BR.store.remember('carousel', 'source', v); syncSourceUI(); });

    BR.ui.chips($('carLangChips'), BR.content.LANGS.map(l => ({ value: l, label: BR.content.LANG_LABELS[l] })), cur.lang,
      v => { cur.lang = v; BR.store.remember('carousel', 'lang', v); fillPacks(); });

    fillPacks();
    syncSourceUI();

    $('carGenerate').addEventListener('click', generate);
    $('carPrev').addEventListener('click', () => go(cur.idx - 1));
    $('carNext').addEventListener('click', () => go(cur.idx + 1));
    $('carRestyle').addEventListener('click', () => {
      cur.styleIdx = (cur.styleIdx + 1) % STYLES.length;
      render();
      BR.ui.toast('Style: ' + (STYLES[cur.styleIdx] || 'brand default'));
    });
    $('carLike').addEventListener('click', () => feedback(1));
    $('carDislike').addEventListener('click', () => feedback(-1));
    $('carRecaption').addEventListener('click', () => {
      // rebuild the caption with a fresh hashtag pass
      const first = cur.caption.split('\n\n')[0];
      cur.caption = first + '\n\n' + BR.content.buildHashtags(cur.lang);
      $('carCaption').value = cur.caption;
    });
    $('carCopyCaption').addEventListener('click', () => BR.ui.copy($('carCaption').value));
    $('carDownloadZip').addEventListener('click', downloadZip);
    $('carDownloadOne').addEventListener('click', downloadOne);
    $('carSave').addEventListener('click', saveToLibrary);
    $('carAddSlide').addEventListener('click', () => {
      cur.slides.splice(cur.idx + 1, 0, { layout: 'point', badge: '', title: 'New slide', body: '' });
      renumber();
      go(cur.idx + 1);
      listUI();
    });

    // start with the taste-favorite pack
    generate();
  }

  function fillPacks() {
    const sel = $('carPackSelect');
    sel.innerHTML = '';
    BR.content.getCarouselPacks(cur.lang).forEach(p => {
      const o = document.createElement('option');
      o.value = p.id;
      o.textContent = BR.content.fill(p.title, cur.lang);
      sel.appendChild(o);
    });
  }

  function syncSourceUI() {
    $('carPackWrap').classList.toggle('hidden', cur.source !== 'pack');
    $('carCustomWrap').classList.toggle('hidden', cur.source !== 'custom');
    $('carAIWrap').classList.toggle('hidden', cur.source !== 'ai');
  }

  async function generate() {
    if (cur.source === 'pack') {
      const packs = BR.content.getCarouselPacks(cur.lang);
      const pack = packs.find(p => p.id === $('carPackSelect').value) || packs[0];
      if (!pack) return;
      const built = BR.content.buildCarouselFromPack(pack, cur.lang);
      apply(built);
    } else if (cur.source === 'custom') {
      const title = $('carCustomTitle').value.trim();
      const lines = $('carCustomPoints').value.split('\n').map(l => l.trim()).filter(Boolean);
      if (!title && !lines.length) { BR.ui.toast('Add a title and a few points first ✏️'); return; }
      apply(BR.content.buildCarouselFromPoints(title, lines, cur.lang));
    } else {
      await generateAI();
    }
  }

  async function generateAI() {
    if (!BR.ai.hasKey()) { BR.ui.toast('Add your Claude API key in Brand & Taste first ✨'); return; }
    const topic = $('carAITopic').value.trim();
    if (!topic) { BR.ui.toast('Type a topic for the AI ✏️'); return; }
    const btn = $('carGenerate');
    btn.disabled = true; btn.textContent = '✨ Designing…';
    try {
      const r = await BR.ai.carousel({ topic, lang: cur.lang });
      const slides = [{ layout: 'cover', badge: r.badge || '', title: r.title, body: '' }];
      (r.slides || []).forEach((s, i) => slides.push({ layout: 'point', badge: String(i + 1).padStart(2, '0'), title: s.title, body: s.body }));
      if (r.ctaTitle) slides.push({ layout: 'cta', badge: '', title: r.ctaTitle, body: r.ctaBody || '' });
      apply({ slides, caption: r.caption || '', ids: [], title: r.title });
      BR.ui.toast('AI carousel ready ✨');
    } catch (e) {
      BR.ui.toast('AI error: ' + e.message.slice(0, 120));
    } finally {
      btn.disabled = false; btn.textContent = '⚡ Build carousel';
    }
  }

  function apply(built) {
    cur.slides = built.slides;
    cur.caption = built.caption;
    cur.ids = built.ids || [];
    cur.title = built.title || 'Carousel';
    cur.idx = 0;
    renumber();
    $('carCaption').value = cur.caption;
    listUI();
    render();
  }

  function renumber() {
    const n = cur.slides.length;
    cur.slides.forEach((s, i) => {
      s.pageNum = i + 1;
      s.pageCount = n;
      s.swipe = i === 0;
    });
  }

  function listUI() {
    const list = $('carSlideList');
    list.innerHTML = '';
    cur.slides.forEach((s, i) => {
      const el = document.createElement('div');
      el.className = 'slide-item' + (i === cur.idx ? ' active' : '');
      el.innerHTML = `
        <span class="si-num">${i + 1}</span>
        <span class="si-title"></span>
        <button class="si-btn" data-act="edit" title="Edit">✏️</button>
        <button class="si-btn" data-act="up" title="Move up">↑</button>
        <button class="si-btn" data-act="down" title="Move down">↓</button>
        <button class="si-btn" data-act="del" title="Delete">✕</button>`;
      el.querySelector('.si-title').textContent = s.title || '(untitled)';
      el.addEventListener('click', e => {
        const act = e.target.dataset && e.target.dataset.act;
        if (act === 'edit') { BR.ui.editSlide(s, () => { listUI(); render(); }); }
        else if (act === 'up' && i > 0) { swap(i, i - 1); }
        else if (act === 'down' && i < cur.slides.length - 1) { swap(i, i + 1); }
        else if (act === 'del') {
          if (cur.slides.length <= 1) return;
          cur.slides.splice(i, 1);
          if (cur.idx >= cur.slides.length) cur.idx = cur.slides.length - 1;
          renumber(); listUI(); render();
        }
        else go(i);
      });
      list.appendChild(el);
    });
  }

  function swap(a, b) {
    [cur.slides[a], cur.slides[b]] = [cur.slides[b], cur.slides[a]];
    cur.idx = b;
    renumber(); listUI(); render();
  }

  function go(i) {
    if (!cur.slides.length) return;
    cur.idx = Math.max(0, Math.min(cur.slides.length - 1, i));
    listUI();
    render();
  }

  async function render() {
    if (!cur.slides.length) return;
    $('carPageInfo').textContent = `${cur.idx + 1} / ${cur.slides.length}`;
    await BR.canvas.renderSlide($('carCanvas'), cur.slides[cur.idx], { w: W, h: H, style: STYLES[cur.styleIdx] });
  }

  function feedback(delta) {
    const styleId = 'style:' + (STYLES[cur.styleIdx] || BR.store.brand.designStyle);
    BR.store.tasteFeedback([...cur.ids, styleId], delta);
    BR.ui.toast(delta > 0 ? '👍 Got it — more like this' : '👎 Noted — I\'ll rank this pack lower');
  }

  async function downloadZip() {
    if (!cur.slides.length) return;
    const btn = $('carDownloadZip');
    btn.disabled = true; btn.textContent = 'Rendering…';
    try {
      const off = document.createElement('canvas');
      const files = [];
      for (let i = 0; i < cur.slides.length; i++) {
        btn.textContent = `Rendering ${i + 1}/${cur.slides.length}…`;
        await BR.canvas.renderSlide(off, cur.slides[i], { w: W, h: H, style: STYLES[cur.styleIdx] });
        const blob = await BR.canvas.canvasToBlob(off);
        files.push({ name: `slide-${String(i + 1).padStart(2, '0')}.png`, data: new Uint8Array(await blob.arrayBuffer()) });
      }
      const zip = BR.zip.makeZip(files);
      BR.zip.downloadBlob(zip, `${BR.store.brand.name.toLowerCase().replace(/\s+/g, '-')}-carousel.zip`);
      BR.ui.toast('⬇ All slides downloaded — post them in order + copy the caption');
    } finally {
      btn.disabled = false; btn.textContent = '⬇ Download all slides (.zip)';
    }
  }

  async function downloadOne() {
    if (!cur.slides.length) return;
    await render();
    BR.canvas.downloadCanvas($('carCanvas'), `slide-${cur.idx + 1}.png`);
  }

  function saveToLibrary() {
    if (!cur.slides.length) return;
    BR.store.saveToLibrary({
      kind: 'carousel',
      title: cur.title || cur.slides[0].title,
      caption: $('carCaption').value,
      data: { slides: cur.slides.map(s => ({ ...s, photo: null })), styleIdx: cur.styleIdx, lang: cur.lang }
    });
    BR.ui.toast('♥ Saved to library');
  }

  function load(item) {
    cur.slides = item.data.slides.map(s => ({ ...s }));
    cur.caption = item.caption;
    cur.styleIdx = item.data.styleIdx || 0;
    cur.title = item.title;
    cur.ids = [];
    cur.idx = 0;
    renumber();
    $('carCaption').value = item.caption;
    listUI();
    render();
  }

  BR.carousel = { init, load };
})();
