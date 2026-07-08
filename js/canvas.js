/* BlazeRent Studio — canvas.js
 * Slide rendering engine. Draws branded 1080x1350 (or any size) slides
 * for posts, carousels and reel covers/video frames, using the brand kit.
 */
window.BR = window.BR || {};

(function () {

  /* ---------- color utils ---------- */
  function hexToRgb(hex) {
    const m = hex.replace('#', '');
    const n = parseInt(m.length === 3 ? m.split('').map(c => c + c).join('') : m, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  function rgba(hex, a) {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r},${g},${b},${a})`;
  }
  function shade(hex, amt) { // amt -1..1
    const { r, g, b } = hexToRgb(hex);
    const f = c => Math.max(0, Math.min(255, Math.round(amt > 0 ? c + (255 - c) * amt : c * (1 + amt))));
    return `rgb(${f(r)},${f(g)},${f(b)})`;
  }
  function isLight(hex) {
    const { r, g, b } = hexToRgb(hex);
    return (0.299 * r + 0.587 * g + 0.114 * b) > 150;
  }

  /* ---------- font stacks ---------- */
  const FONTS = {
    bold:  { head: '"Arial Black", "Helvetica Neue", Arial, sans-serif', body: '"Helvetica Neue", Arial, sans-serif', headWeight: '900', bodyWeight: '500' },
    clean: { head: '"Helvetica Neue", Arial, sans-serif', body: '"Helvetica Neue", Arial, sans-serif', headWeight: '800', bodyWeight: '400' },
    serif: { head: 'Georgia, "Times New Roman", serif', body: 'Georgia, serif', headWeight: '700', bodyWeight: '400' },
    mono:  { head: '"Courier New", Courier, monospace', body: '"Courier New", monospace', headWeight: '700', bodyWeight: '400' }
  };
  function fontOf() { return FONTS[BR.store.brand.font] || FONTS.bold; }

  /* ---------- theme resolution ---------- */
  function theme(styleOverride) {
    const b = BR.store.brand;
    const c = b.colors;
    const style = styleOverride || b.designStyle;
    switch (style) {
      case 'esports':
        return { style, bg: [shade(c.dark, -0.55), '#000000'], text: '#ffffff', sub: 'rgba(214,222,255,0.7)', accent: c.primary, accent2: shade(c.primary, 0.3), chip: c.primary };
      case 'dark':
        return { style, bg: [c.dark, shade(c.dark, -0.4)], text: '#ffffff', sub: 'rgba(255,255,255,0.72)', accent: c.primary, accent2: c.accent, chip: c.primary };
      case 'light':
        return { style, bg: [c.light, shade(c.light, -0.06)], text: shade(c.dark, -0.1), sub: rgba(c.dark, 0.72), accent: c.primary, accent2: c.primary, chip: c.primary };
      case 'solid':
        return { style, bg: [c.primary, c.primary], text: isLight(c.primary) ? '#111111' : '#ffffff', sub: isLight(c.primary) ? 'rgba(0,0,0,.7)' : 'rgba(255,255,255,.8)', accent: c.accent, accent2: c.accent, chip: c.dark };
      case 'gradient':
      default:
        return { style: 'gradient', bg: [c.primary, shade(c.dark, -0.2)], text: '#ffffff', sub: 'rgba(255,255,255,0.78)', accent: c.accent, accent2: c.accent, chip: c.accent };
    }
  }

  /* ---------- image cache ---------- */
  const imgCache = {};
  function loadImage(src) {
    if (!src) return Promise.resolve(null);
    if (imgCache[src]) return Promise.resolve(imgCache[src]);
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => { imgCache[src] = img; resolve(img); };
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }
  function getLogoSync() {
    const src = BR.store.brand.logo;
    if (!src) return null;
    if (imgCache[src]) return imgCache[src];
    loadImage(src); // warm the cache for the next render
    return null;
  }

  /* ---------- text helpers ---------- */
  function wrapLines(ctx, text, maxWidth) {
    const words = String(text).split(/\s+/).filter(Boolean);
    const lines = [];
    let line = '';
    for (const w of words) {
      const probe = line ? line + ' ' + w : w;
      if (ctx.measureText(probe).width > maxWidth && line) {
        lines.push(line);
        line = w;
      } else line = probe;
    }
    if (line) lines.push(line);
    return lines;
  }

  // Find the largest font size (<= max) whose wrapped text fits maxLines
  function fitText(ctx, text, { font, weight, maxWidth, maxSize, minSize, maxLines }) {
    let size = maxSize;
    let lines;
    while (size > minSize) {
      ctx.font = `${weight} ${size}px ${font}`;
      lines = wrapLines(ctx, text, maxWidth);
      if (lines.length <= maxLines) break;
      size -= 4;
    }
    ctx.font = `${weight} ${size}px ${font}`;
    lines = wrapLines(ctx, text, maxWidth);
    if (lines.length > maxLines) {
      lines = lines.slice(0, maxLines);
      lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, '…');
    }
    return { size, lines };
  }

  function drawLines(ctx, lines, x, y, lineHeight) {
    lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
    return y + lines.length * lineHeight;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // angular HUD-style tag shape (parallelogram), used by the esports style
  function parallelogram(ctx, x, y, w, h, skew) {
    ctx.beginPath();
    ctx.moveTo(x + skew, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w - skew, y + h);
    ctx.lineTo(x, y + h);
    ctx.closePath();
  }

  /* ---------- background + decor ---------- */
  function fillBg(ctx, w, h, th) {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, th.bg[0]);
    g.addColorStop(1, th.bg[1]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    if (th.style === 'esports') {
      drawEsportsDecor(ctx, w, h, th);
      return;
    }

    // decorative glow blobs
    ctx.save();
    ctx.globalAlpha = th.style === 'light' ? 0.10 : 0.16;
    const blob = (x, y, r, col) => {
      const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
      rg.addColorStop(0, col);
      rg.addColorStop(1, 'transparent');
      ctx.fillStyle = rg;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    };
    blob(w * 0.9, h * 0.08, w * 0.5, th.accent);
    blob(w * 0.05, h * 0.95, w * 0.55, th.accent2);
    ctx.restore();
  }

  // gaming HUD backdrop: faint grid + a diagonal glow beam + edge vignette
  function drawEsportsDecor(ctx, w, h, th) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    const step = w * 0.062;
    for (let x = 0; x <= w; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y <= h; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    ctx.save();
    ctx.translate(w * 0.8, h * -0.02);
    ctx.rotate(-0.42);
    const beamW = w * 1.8, beamH = h * 0.5;
    const beam = ctx.createLinearGradient(0, 0, 0, beamH);
    beam.addColorStop(0, rgba(th.accent, 0.4));
    beam.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = beam;
    ctx.fillRect(-beamW / 2, -beamH * 0.15, beamW, beamH);
    ctx.restore();

    const vg = ctx.createRadialGradient(w / 2, h * 0.46, h * 0.32, w / 2, h * 0.46, h * 0.78);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  // small HUD corner brackets, drawn over the finished slide for the esports style
  function drawHudCorners(ctx, w, h, th) {
    const len = w * 0.048, pad = w * 0.045, lw = Math.max(2, w * 0.0035);
    ctx.save();
    ctx.strokeStyle = th.accent;
    ctx.lineWidth = lw;
    ctx.shadowColor = th.accent;
    ctx.shadowBlur = w * 0.018;
    ctx.lineCap = 'square';
    [[pad, pad, 1, 1], [w - pad, pad, -1, 1], [pad, h - pad, 1, -1], [w - pad, h - pad, -1, -1]]
      .forEach(([x, y, dx, dy]) => {
        ctx.beginPath();
        ctx.moveTo(x, y + len * dy);
        ctx.lineTo(x, y);
        ctx.lineTo(x + len * dx, y);
        ctx.stroke();
      });
    ctx.restore();
  }

  // wraps a draw callback with a colored glow — used for esports-style headline text
  function withGlow(ctx, th, w, fn) {
    if (th.style !== 'esports') return fn();
    ctx.save();
    ctx.shadowColor = th.accent;
    ctx.shadowBlur = w * 0.022;
    fn();
    ctx.restore();
  }

  function drawPhotoCover(ctx, img, w, h, zoom = 1, panX = 0.5, panY = 0.5) {
    const ir = img.width / img.height, cr = w / h;
    let sw, sh;
    if (ir > cr) { sh = img.height / zoom; sw = sh * cr; }
    else { sw = img.width / zoom; sh = sw / cr; }
    const sx = (img.width - sw) * panX;
    const sy = (img.height - sh) * panY;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
  }

  /* ---------- brand chrome (header / footer) ---------- */
  function drawChrome(ctx, w, h, th, slide) {
    const b = BR.store.brand;
    const m = w * 0.074; // margin
    const f = fontOf();

    // header: logo/dot + brand name
    const logo = getLogoSync();
    const logoSize = w * 0.052;
    ctx.save();
    if (logo) {
      ctx.save();
      roundRect(ctx, m, m * 0.8, logoSize, logoSize, logoSize * 0.28);
      ctx.clip();
      ctx.drawImage(logo, m, m * 0.8, logoSize, logoSize);
      ctx.restore();
    } else {
      ctx.fillStyle = th.accent;
      ctx.beginPath();
      ctx.arc(m + logoSize / 2, m * 0.8 + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = th.style === 'light' ? '#ffffff' : th.bg[1];
      ctx.font = `900 ${logoSize * 0.55}px ${f.head}`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText((b.name || 'B')[0].toUpperCase(), m + logoSize / 2, m * 0.8 + logoSize / 2 + logoSize * 0.03);
    }
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillStyle = th.text;
    ctx.font = `800 ${w * 0.028}px ${f.head}`;
    ctx.fillText((b.name || 'BlazeRent').toUpperCase(), m + logoSize + w * 0.018, m * 0.8 + logoSize / 2);

    // header right: page counter
    if (slide.pageCount > 1) {
      ctx.textAlign = 'right';
      ctx.fillStyle = th.sub;
      ctx.font = `700 ${w * 0.026}px ${f.body}`;
      ctx.fillText(`${slide.pageNum} / ${slide.pageCount}`, w - m, m * 0.8 + logoSize / 2);
    }

    // footer: handle + swipe hint
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = th.sub;
    ctx.font = `700 ${w * 0.026}px ${f.body}`;
    ctx.fillText(b.handle || '', m, h - m * 0.75);
    if (slide.swipe) {
      ctx.textAlign = 'right';
      ctx.fillStyle = th.accent;
      ctx.font = `800 ${w * 0.028}px ${f.body}`;
      ctx.fillText((slide.swipeText || 'swipe') + '  ⟶', w - m, h - m * 0.75);
    }
    ctx.restore();
    if (th.style === 'esports') drawHudCorners(ctx, w, h, th);
  }

  function drawBadge(ctx, text, x, y, th, w) {
    if (!text) return y;
    const f = fontOf();
    const size = w * 0.026;
    ctx.font = `800 ${size}px ${f.body}`;
    const tw = ctx.measureText(text).width;
    const padX = size * 1.1, padY = size * 0.72;
    const boxW = tw + padX * 2, boxH = size + padY * 2;

    if (th.style === 'esports') {
      const skew = boxH * 0.4;
      ctx.save();
      ctx.fillStyle = th.chip;
      ctx.shadowColor = th.chip;
      ctx.shadowBlur = w * 0.014;
      parallelogram(ctx, x, y, boxW + skew, boxH, skew);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = isLight(th.chip) ? '#0a0f24' : '#ffffff';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.fillText(text, x + padX + skew * 0.55, y + boxH / 2 + size * 0.06);
      ctx.textBaseline = 'alphabetic';
      ctx.restore();
      return y + boxH;
    }

    ctx.fillStyle = th.chip;
    roundRect(ctx, x, y, boxW, boxH, boxH / 2);
    ctx.fill();
    ctx.fillStyle = isLight(th.chip.startsWith('#') ? th.chip : '#000000') ? '#111111' : '#ffffff';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText(text, x + padX, y + boxH / 2 + size * 0.06);
    ctx.textBaseline = 'alphabetic';
    return y + boxH;
  }

  /* =====================================================================
   * renderSlide — the main entry point
   * slide: {layout, badge, title, body, photo(dataURL), pageNum, pageCount, swipe}
   * opts:  {w, h, style}   (style overrides brand.designStyle)
   * ===================================================================== */
  async function renderSlide(canvas, slide, opts = {}) {
    const w = opts.w || 1080, h = opts.h || 1350;
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    const th = theme(opts.style);
    const f = fontOf();
    const m = w * 0.074;
    const maxW = w - m * 2;

    // make sure images are decoded before drawing
    const photo = slide.photo ? await loadImage(slide.photo) : null;
    if (BR.store.brand.logo) await loadImage(BR.store.brand.logo);

    fillBg(ctx, w, h, th);

    if (photo) {
      drawPhotoCover(ctx, photo, w, h);
      // legibility gradient
      const g = ctx.createLinearGradient(0, h * 0.35, 0, h);
      g.addColorStop(0, 'rgba(10,8,14,0)');
      g.addColorStop(1, 'rgba(10,8,14,0.88)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      const gt = ctx.createLinearGradient(0, 0, 0, h * 0.2);
      gt.addColorStop(0, 'rgba(10,8,14,0.55)');
      gt.addColorStop(1, 'rgba(10,8,14,0)');
      ctx.fillStyle = gt;
      ctx.fillRect(0, 0, w, h * 0.2);
    }

    const thEff = photo
      ? { ...th, text: '#ffffff', sub: 'rgba(255,255,255,0.8)' }
      : th;

    switch (slide.layout) {
      case 'cover': renderCover(ctx, slide, thEff, f, w, h, m, maxW, !!photo); break;
      case 'point': renderPoint(ctx, slide, thEff, f, w, h, m, maxW, !!photo); break;
      case 'cta': renderCta(ctx, slide, thEff, f, w, h, m, maxW); break;
      case 'quote': renderQuote(ctx, slide, thEff, f, w, h, m, maxW); break;
      case 'promo':
      default: renderPromo(ctx, slide, thEff, f, w, h, m, maxW, !!photo); break;
    }

    drawChrome(ctx, w, h, thEff, slide);
    return canvas;
  }

  /* ---------- layouts ---------- */
  function renderCover(ctx, s, th, f, w, h, m, maxW, hasPhoto) {
    let y = hasPhoto ? h * 0.58 : h * 0.30;
    if (s.badge) y = drawBadge(ctx, s.badge, m, y, th, w) + h * 0.035;
    const fit = fitText(ctx, s.title, { font: f.head, weight: f.headWeight, maxWidth: maxW, maxSize: w * 0.098, minSize: w * 0.05, maxLines: 5 });
    ctx.fillStyle = th.text;
    ctx.textAlign = 'left';
    ctx.font = `${f.headWeight} ${fit.size}px ${f.head}`;
    withGlow(ctx, th, w, () => { y = drawLines(ctx, fit.lines, m, y + fit.size, fit.size * 1.12); });
    if (s.body) {
      ctx.fillStyle = th.sub;
      const bf = fitText(ctx, s.body, { font: f.body, weight: f.bodyWeight, maxWidth: maxW * 0.9, maxSize: w * 0.034, minSize: w * 0.024, maxLines: 4 });
      ctx.font = `${f.bodyWeight} ${bf.size}px ${f.body}`;
      drawLines(ctx, bf.lines, m, y + h * 0.03, bf.size * 1.45);
    }
    // accent underline
    ctx.save();
    ctx.fillStyle = th.accent;
    if (th.style === 'esports') {
      ctx.shadowColor = th.accent;
      ctx.shadowBlur = w * 0.016;
      parallelogram(ctx, m, y + h * 0.012, w * 0.16, w * 0.012, w * 0.006);
    } else {
      roundRect(ctx, m, y + h * 0.012, w * 0.16, w * 0.012, w * 0.006);
    }
    ctx.fill();
    ctx.restore();
  }

  function renderPoint(ctx, s, th, f, w, h, m, maxW, hasPhoto) {
    // ghost number
    if (s.badge && !hasPhoto) {
      ctx.save();
      const alpha = th.style === 'light' ? 0.18 : th.style === 'esports' ? 0.28 : 0.22;
      ctx.fillStyle = rgba(th.accent, alpha);
      ctx.font = `900 ${w * 0.42}px ${f.head}`;
      ctx.textAlign = 'right';
      ctx.fillText(s.badge, w - m * 0.6, h * 0.36);
      ctx.restore();
    }
    let y = hasPhoto ? h * 0.6 : h * 0.40;
    if (s.badge && hasPhoto) y = drawBadge(ctx, s.badge, m, y - h * 0.02, th, w) + h * 0.03;
    const fit = fitText(ctx, s.title, { font: f.head, weight: f.headWeight, maxWidth: maxW, maxSize: w * 0.066, minSize: w * 0.04, maxLines: 3 });
    ctx.fillStyle = th.text;
    ctx.textAlign = 'left';
    ctx.font = `${f.headWeight} ${fit.size}px ${f.head}`;
    withGlow(ctx, th, w, () => { y = drawLines(ctx, fit.lines, m, y + fit.size, fit.size * 1.15); });
    if (s.body) {
      ctx.fillStyle = th.sub;
      const bf = fitText(ctx, s.body, { font: f.body, weight: f.bodyWeight, maxWidth: maxW * 0.94, maxSize: w * 0.036, minSize: w * 0.026, maxLines: 6 });
      ctx.font = `${f.bodyWeight} ${bf.size}px ${f.body}`;
      drawLines(ctx, bf.lines, m, y + h * 0.035, bf.size * 1.5);
    }
  }

  function renderCta(ctx, s, th, f, w, h, m, maxW) {
    ctx.textAlign = 'center';
    let y = h * 0.36;
    const fit = fitText(ctx, s.title, { font: f.head, weight: f.headWeight, maxWidth: maxW, maxSize: w * 0.08, minSize: w * 0.045, maxLines: 3 });
    ctx.fillStyle = th.text;
    ctx.font = `${f.headWeight} ${fit.size}px ${f.head}`;
    withGlow(ctx, th, w, () => fit.lines.forEach((l, i) => ctx.fillText(l, w / 2, y + i * fit.size * 1.15)));
    y += fit.lines.length * fit.size * 1.15 + h * 0.03;
    if (s.body) {
      ctx.fillStyle = th.sub;
      const bf = fitText(ctx, s.body, { font: f.body, weight: f.bodyWeight, maxWidth: maxW * 0.82, maxSize: w * 0.036, minSize: w * 0.026, maxLines: 4 });
      ctx.font = `${f.bodyWeight} ${bf.size}px ${f.body}`;
      bf.lines.forEach((l, i) => ctx.fillText(l, w / 2, y + i * bf.size * 1.5));
      y += bf.lines.length * bf.size * 1.5;
    }
    // handle pill
    const b = BR.store.brand;
    const label = b.handle || b.name;
    ctx.font = `800 ${w * 0.034}px ${f.body}`;
    const tw = ctx.measureText(label).width;
    const pw = tw + w * 0.08, ph = w * 0.085;
    const px = (w - pw) / 2, py = y + h * 0.035;
    ctx.save();
    ctx.fillStyle = th.accent;
    if (th.style === 'esports') {
      const skew = ph * 0.32;
      ctx.shadowColor = th.accent;
      ctx.shadowBlur = w * 0.018;
      parallelogram(ctx, px - skew / 2, py, pw + skew, ph, skew);
    } else {
      roundRect(ctx, px, py, pw, ph, ph / 2);
    }
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = isLight(th.style === 'esports' ? th.accent : BR.store.brand.colors.accent) ? '#111111' : '#ffffff';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, w / 2, py + ph / 2 + w * 0.003);
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
  }

  function renderQuote(ctx, s, th, f, w, h, m, maxW) {
    ctx.fillStyle = th.accent;
    ctx.font = `900 ${w * 0.22}px Georgia, serif`;
    ctx.fillText('“', m, h * 0.3);
    let y = h * 0.36;
    const fit = fitText(ctx, s.title, { font: f.head, weight: f.headWeight, maxWidth: maxW, maxSize: w * 0.058, minSize: w * 0.036, maxLines: 6 });
    ctx.fillStyle = th.text;
    ctx.font = `${f.headWeight} ${fit.size}px ${f.head}`;
    y = drawLines(ctx, fit.lines, m, y, fit.size * 1.3);
    if (s.body) {
      ctx.fillStyle = th.accent;
      ctx.font = `700 ${w * 0.03}px ${f.body}`;
      ctx.fillText('— ' + s.body, m, y + h * 0.04);
    }
  }

  function renderPromo(ctx, s, th, f, w, h, m, maxW, hasPhoto) {
    let y = hasPhoto ? h * 0.52 : h * 0.26;
    if (s.badge) y = drawBadge(ctx, s.badge, m, y, th, w) + h * 0.04;
    const fit = fitText(ctx, s.title, { font: f.head, weight: f.headWeight, maxWidth: maxW, maxSize: w * 0.088, minSize: w * 0.046, maxLines: 4 });
    ctx.fillStyle = th.text;
    ctx.textAlign = 'left';
    ctx.font = `${f.headWeight} ${fit.size}px ${f.head}`;
    withGlow(ctx, th, w, () => { y = drawLines(ctx, fit.lines, m, y + fit.size, fit.size * 1.12); });
    if (s.body) {
      // offer box
      ctx.font = `800 ${w * 0.04}px ${f.head}`;
      const bf = fitText(ctx, s.body, { font: f.head, weight: '800', maxWidth: maxW * 0.8, maxSize: w * 0.042, minSize: w * 0.028, maxLines: 3 });
      const boxH = bf.lines.length * bf.size * 1.3 + w * 0.05;
      const boxW = Math.min(maxW, Math.max(...bf.lines.map(l => { ctx.font = `800 ${bf.size}px ${f.head}`; return ctx.measureText(l).width; })) + w * 0.07);
      y += h * 0.035;
      ctx.save();
      ctx.fillStyle = th.accent;
      if (th.style === 'esports') {
        const skew = boxH * 0.3;
        ctx.shadowColor = th.accent;
        ctx.shadowBlur = w * 0.016;
        parallelogram(ctx, m, y, boxW + skew, boxH, skew);
      } else {
        roundRect(ctx, m, y, boxW, boxH, w * 0.02);
      }
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = isLight(th.style === 'esports' ? th.accent : BR.store.brand.colors.accent) ? '#111111' : '#ffffff';
      ctx.font = `800 ${bf.size}px ${f.head}`;
      bf.lines.forEach((l, i) => ctx.fillText(l, m + w * 0.035, y + w * 0.045 + (i + 0.5) * bf.size * 1.3));
    }
  }

  /* ---------- export helpers ---------- */
  function downloadCanvas(canvas, filename) {
    canvas.toBlob(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    }, 'image/png');
  }

  function canvasToBlob(canvas) {
    return new Promise(res => canvas.toBlob(res, 'image/png'));
  }

  BR.canvas = {
    renderSlide, downloadCanvas, canvasToBlob,
    loadImage, drawPhotoCover, fillBg, theme, fontOf, fitText, wrapLines, roundRect, drawChrome,
    parallelogram, drawHudCorners, withGlow,
    isLight, rgba, shade
  };
})();
