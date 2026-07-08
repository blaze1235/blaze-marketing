/* BlazeRent Studio — reel.js
 * Reel Studio: shot-by-shot scripts + an actual rendered 1080x1920 video
 * (canvas + MediaRecorder) with animated captions and Ken Burns photos.
 */
window.BR = window.BR || {};

(function () {
  const $ = id => document.getElementById(id);
  const W = 1080, H = 1920;

  const cur = {
    source: 'pack', lang: 'en',
    reel: null,          // {title, format, audio, scenes[], caption, ids}
    rendering: false
  };

  function init() {
    const b = BR.store.brand;
    cur.lang = BR.store.recall('reel', 'lang', b.lang);
    cur.source = BR.store.recall('reel', 'source', 'pack');

    BR.ui.chips($('reelSourceChips'), [
      { value: 'pack', label: '📦 Ready-made' },
      { value: 'ai', label: '✨ AI topic' }
    ], cur.source, v => { cur.source = v; BR.store.remember('reel', 'source', v); syncSourceUI(); });

    BR.ui.chips($('reelLangChips'), BR.content.LANGS.map(l => ({ value: l, label: BR.content.LANG_LABELS[l] })), cur.lang,
      v => { cur.lang = v; BR.store.remember('reel', 'lang', v); fillPacks(); });

    fillPacks();
    syncSourceUI();

    $('reelGenerate').addEventListener('click', generate);
    $('reelSceneDur').addEventListener('input', () => {
      $('reelDurLabel').textContent = $('reelSceneDur').value + 's per scene';
    });
    $('reelRender').addEventListener('click', renderVideo);
    $('reelLike').addEventListener('click', () => feedback(1));
    $('reelDislike').addEventListener('click', () => feedback(-1));
    $('reelCopyScript').addEventListener('click', copyScript);
    $('reelRecaption').addEventListener('click', () => {
      if (!cur.reel) return;
      const first = cur.reel.caption.split('\n\n')[0];
      cur.reel.caption = first + '\n\n' + BR.content.buildHashtags(cur.lang);
      $('reelCaption').value = cur.reel.caption;
    });
    $('reelCopyCaption').addEventListener('click', () => BR.ui.copy($('reelCaption').value));
    $('reelCover').addEventListener('click', downloadCover);
    $('reelSave').addEventListener('click', saveToLibrary);

    generate();
  }

  function fillPacks() {
    const sel = $('reelPackSelect');
    sel.innerHTML = '';
    BR.content.getReelPacks(cur.lang).forEach(p => {
      const o = document.createElement('option');
      o.value = p.id;
      o.textContent = BR.content.fill(p.title, cur.lang) + ' · ' + p.format;
      sel.appendChild(o);
    });
  }

  function syncSourceUI() {
    $('reelPackWrap').classList.toggle('hidden', cur.source !== 'pack');
    $('reelAIWrap').classList.toggle('hidden', cur.source !== 'ai');
  }

  async function generate() {
    if (cur.source === 'pack') {
      const packs = BR.content.getReelPacks(cur.lang);
      const pack = packs.find(p => p.id === $('reelPackSelect').value) || packs[0];
      if (!pack) return;
      apply(BR.content.buildReel(pack, cur.lang));
    } else {
      await generateAI();
    }
  }

  async function generateAI() {
    if (!BR.ai.hasKey()) { BR.ui.toast('Add your Claude API key in Brand & Taste first ✨'); return; }
    const topic = $('reelAITopic').value.trim();
    if (!topic) { BR.ui.toast('Type a topic for the AI ✏️'); return; }
    const btn = $('reelGenerate');
    btn.disabled = true; btn.textContent = '✨ Directing…';
    try {
      const r = await BR.ai.reel({ topic, lang: cur.lang });
      apply({
        title: r.title, format: r.format || 'AI concept', audio: r.audio || '',
        scenes: (r.scenes || []).map(s => ({ shot: s.shot, onscreen: s.onscreen, voice: s.voice || '', photo: null })),
        caption: r.caption || '', ids: []
      });
      BR.ui.toast('AI reel script ready ✨');
    } catch (e) {
      BR.ui.toast('AI error: ' + e.message.slice(0, 120));
    } finally {
      btn.disabled = false; btn.textContent = '⚡ Generate reel script';
    }
  }

  function apply(reel) {
    cur.reel = reel;
    $('reelTitle').textContent = reel.title;
    $('reelCaption').value = reel.caption;
    $('reelMeta').innerHTML = '';
    const tags = [
      `<span class="tag">🎞 <b>${esc(reel.format)}</b></span>`,
      reel.audio ? `<span class="tag">🎵 ${esc(reel.audio)}</span>` : '',
      `<span class="tag">⏱ ~${Math.round(reel.scenes.length * parseFloat($('reelSceneDur').value))}s</span>`
    ].join('');
    $('reelMeta').innerHTML = tags;
    scenesUI();
    $('reelRenderOut').innerHTML = '';
  }

  function esc(s) {
    const d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  function scenesUI() {
    const wrap = $('reelScenes');
    wrap.innerHTML = '';
    cur.reel.scenes.forEach((s, i) => {
      const el = document.createElement('div');
      el.className = 'scene';
      el.innerHTML = `
        <div class="scene-thumb${s.photo ? ' has-img' : ''}" title="Click to add a photo for the video render">${s.photo ? '' : '+ add<br>photo'}</div>
        <div>
          <h4>Scene ${i + 1} — ${esc(s.shot)}</h4>
          <div class="sc-onscreen" contenteditable="true" spellcheck="false"></div>
          ${s.voice ? `<div class="sc-voice">🎙 ${esc(s.voice)}</div>` : ''}
        </div>`;
      const thumb = el.querySelector('.scene-thumb');
      if (s.photo) thumb.style.backgroundImage = `url(${s.photo})`;
      const onscreenEl = el.querySelector('.sc-onscreen');
      onscreenEl.textContent = s.onscreen;
      onscreenEl.addEventListener('input', () => { s.onscreen = onscreenEl.textContent; });

      const input = document.createElement('input');
      input.type = 'file'; input.accept = 'image/*'; input.className = 'hidden';
      el.appendChild(input);
      thumb.addEventListener('click', () => input.click());
      input.addEventListener('change', async () => {
        const file = input.files[0];
        if (!file) return;
        s.photo = await BR.ui.fileToDataURL(file, 1920);
        thumb.style.backgroundImage = `url(${s.photo})`;
        thumb.classList.add('has-img');
        thumb.innerHTML = '';
      });
      wrap.appendChild(el);
    });
  }

  function feedback(delta) {
    if (!cur.reel) return;
    BR.store.tasteFeedback(cur.reel.ids || [], delta);
    BR.ui.toast(delta > 0 ? '👍 Got it — more concepts like this' : '👎 Noted');
  }

  function copyScript() {
    if (!cur.reel) return;
    const r = cur.reel;
    const lines = [
      `🎬 ${r.title}`,
      `Format: ${r.format}`,
      r.audio ? `Audio: ${r.audio}` : '',
      ''
    ];
    r.scenes.forEach((s, i) => {
      lines.push(`SCENE ${i + 1}`);
      lines.push(`  Film: ${s.shot}`);
      lines.push(`  On-screen text: ${s.onscreen}`);
      if (s.voice) lines.push(`  Voiceover: ${s.voice}`);
      lines.push('');
    });
    lines.push('CAPTION:', $('reelCaption').value);
    BR.ui.copy(lines.filter(l => l !== undefined).join('\n'));
  }

  /* ---------- cover image ---------- */
  async function downloadCover() {
    if (!cur.reel) return;
    const off = document.createElement('canvas');
    const firstPhoto = cur.reel.scenes.find(s => s.photo);
    await BR.canvas.renderSlide(off, {
      layout: 'cover',
      badge: 'REEL',
      title: cur.reel.scenes[0] ? cur.reel.scenes[0].onscreen : cur.reel.title,
      body: '',
      photo: firstPhoto ? firstPhoto.photo : null,
      pageCount: 1, pageNum: 1, swipe: false
    }, { w: W, h: H });
    BR.canvas.downloadCanvas(off, 'reel-cover.png');
    BR.ui.toast('⬇ Cover downloaded');
  }

  /* ---------- video rendering ---------- */
  function pickMime() {
    const candidates = [
      'video/mp4;codecs=avc1', 'video/mp4',
      'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'
    ];
    for (const c of candidates) {
      if (window.MediaRecorder && MediaRecorder.isTypeSupported(c)) return c;
    }
    return null;
  }

  async function renderVideo() {
    if (!cur.reel || cur.rendering) return;
    if (!window.MediaRecorder) { BR.ui.toast('This browser can\'t record video — try Chrome'); return; }
    const mime = pickMime();
    if (!mime) { BR.ui.toast('No supported video format in this browser — try Chrome'); return; }

    cur.rendering = true;
    const btn = $('reelRender');
    btn.disabled = true; btn.textContent = '🎥 Rendering…';
    $('reelProgress').classList.remove('hidden');

    try {
      const sceneDur = parseFloat($('reelSceneDur').value) * 1000;
      const scenes = cur.reel.scenes;
      const total = scenes.length * sceneDur;

      // preload photos
      const photos = [];
      for (const s of scenes) photos.push(s.photo ? await BR.canvas.loadImage(s.photo) : null);
      if (BR.store.brand.logo) await BR.canvas.loadImage(BR.store.brand.logo);

      const canvas = document.createElement('canvas');
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext('2d');

      const stream = canvas.captureStream(30);
      const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8_000_000 });
      const chunks = [];
      rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
      const done = new Promise(res => { rec.onstop = res; });
      rec.start(200);

      const t0 = performance.now();
      await new Promise(resolve => {
        function frame(now) {
          const t = now - t0;
          if (t >= total) { resolve(); return; }
          drawFrame(ctx, scenes, photos, t, sceneDur);
          $('reelProgressFill').style.width = Math.round((t / total) * 100) + '%';
          requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      });

      rec.stop();
      await done;
      stream.getTracks().forEach(tr => tr.stop());

      const ext = mime.startsWith('video/mp4') ? 'mp4' : 'webm';
      const blob = new Blob(chunks, { type: mime.split(';')[0] });
      const url = URL.createObjectURL(blob);
      const out = $('reelRenderOut');
      out.innerHTML = '';
      const vid = document.createElement('video');
      vid.src = url; vid.controls = true; vid.muted = true; vid.playsInline = true;
      const a = document.createElement('a');
      a.href = url; a.download = `${BR.store.brand.name.toLowerCase().replace(/\s+/g, '-')}-reel.${ext}`;
      a.className = 'btn'; a.textContent = `⬇ Download video (.${ext})`;
      out.appendChild(vid);
      out.appendChild(a);
      if (ext === 'webm') {
        const note = document.createElement('p');
        note.className = 'hint block';
        note.textContent = 'Tip: Instagram prefers MP4. Most phones/apps convert WebM automatically, or drop it into CapCut to add your trending audio.';
        out.appendChild(note);
      }
      $('reelProgressFill').style.width = '100%';
      BR.ui.toast('🎬 Video rendered!');
    } catch (e) {
      console.error(e);
      BR.ui.toast('Render failed: ' + e.message.slice(0, 120));
    } finally {
      cur.rendering = false;
      btn.disabled = false; btn.textContent = '🎥 Render video';
      setTimeout(() => $('reelProgress').classList.add('hidden'), 800);
    }
  }

  function drawFrame(ctx, scenes, photos, t, sceneDur) {
    const i = Math.min(scenes.length - 1, Math.floor(t / sceneDur));
    const local = (t - i * sceneDur) / sceneDur; // 0..1 within scene
    const scene = scenes[i];
    const th = BR.canvas.theme();
    const f = BR.canvas.fontOf();
    const b = BR.store.brand;
    const m = W * 0.085;

    // background
    BR.canvas.fillBg(ctx, W, H, th);
    if (photos[i]) {
      // Ken Burns: slow zoom + alternating pan
      const zoom = 1 + 0.1 * local;
      const panX = i % 2 === 0 ? 0.5 - 0.06 * local : 0.44 + 0.06 * local;
      BR.canvas.drawPhotoCover(ctx, photos[i], W, H, zoom, panX, 0.5);
      const g = ctx.createLinearGradient(0, H * 0.45, 0, H);
      g.addColorStop(0, 'rgba(8,6,12,0)');
      g.addColorStop(1, 'rgba(8,6,12,0.85)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      const gt = ctx.createLinearGradient(0, 0, 0, H * 0.18);
      gt.addColorStop(0, 'rgba(8,6,12,0.6)');
      gt.addColorStop(1, 'rgba(8,6,12,0)');
      ctx.fillStyle = gt;
      ctx.fillRect(0, 0, W, H * 0.18);
    }

    const textCol = photos[i] ? '#ffffff' : th.text;

    // on-screen text: pop-in (fade + rise) during the first 18% of the scene
    const appear = Math.min(1, local / 0.18);
    const ease = 1 - Math.pow(1 - appear, 3);
    ctx.save();
    ctx.globalAlpha = ease;
    const rise = (1 - ease) * H * 0.02;

    const fit = BR.canvas.fitText(ctx, scene.onscreen || '', {
      font: f.head, weight: f.headWeight, maxWidth: W - m * 2,
      maxSize: W * 0.075, minSize: W * 0.04, maxLines: 5
    });
    ctx.font = `${f.headWeight} ${fit.size}px ${f.head}`;
    ctx.textAlign = 'center';
    const lineH = fit.size * 1.2;
    const blockH = fit.lines.length * lineH;
    const yBase = photos[i] ? H * 0.78 - blockH : H * 0.5 - blockH / 2;

    // soft backdrop behind text for legibility on busy photos
    if (photos[i]) {
      ctx.save();
      ctx.globalAlpha = ease * 0.25;
      ctx.fillStyle = '#000000';
      BR.canvas.roundRect(ctx, m * 0.5, yBase - lineH * 0.9, W - m, blockH + lineH * 0.9, W * 0.02);
      ctx.fill();
      ctx.restore();
    }

    ctx.fillStyle = textCol;
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = W * 0.012;
    fit.lines.forEach((l, li) => ctx.fillText(l, W / 2, yBase + rise + li * lineH));
    ctx.shadowBlur = 0;
    ctx.restore();

    // progress bar (top) — like IG story segments
    const segW = (W - m * 2 - (scenes.length - 1) * 10) / scenes.length;
    for (let s = 0; s < scenes.length; s++) {
      const x = m + s * (segW + 10);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      BR.canvas.roundRect(ctx, x, m * 0.6, segW, 8, 4);
      ctx.fill();
      const fillW = s < i ? segW : s === i ? segW * local : 0;
      if (fillW > 0) {
        ctx.fillStyle = th.accent;
        BR.canvas.roundRect(ctx, x, m * 0.6, Math.max(8, fillW), 8, 4);
        ctx.fill();
      }
    }

    // brand footer
    ctx.textAlign = 'center';
    ctx.fillStyle = photos[i] ? 'rgba(255,255,255,0.85)' : th.sub;
    ctx.font = `800 ${W * 0.03}px ${f.body}`;
    ctx.fillText(b.handle || b.name, W / 2, H - m * 0.8);
  }

  function saveToLibrary() {
    if (!cur.reel) return;
    BR.store.saveToLibrary({
      kind: 'reel',
      title: cur.reel.title,
      caption: $('reelCaption').value,
      data: {
        title: cur.reel.title, format: cur.reel.format, audio: cur.reel.audio,
        scenes: cur.reel.scenes.map(s => ({ shot: s.shot, onscreen: s.onscreen, voice: s.voice, photo: null })),
        lang: cur.lang
      }
    });
    BR.ui.toast('♥ Saved to library');
  }

  function load(item) {
    apply({
      title: item.data.title, format: item.data.format, audio: item.data.audio,
      scenes: item.data.scenes.map(s => ({ ...s })),
      caption: item.caption, ids: []
    });
  }

  BR.reel = { init, load };
})();
