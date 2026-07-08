/* BlazeRent Studio — post.js
 * Post Studio: one-click branded image + caption + hashtags.
 */
window.BR = window.BR || {};

(function () {
  const $ = id => document.getElementById(id);

  const BADGES = {
    promo: { en: 'HOT DEAL', ru: 'ГОРЯЧЕЕ ПРЕДЛОЖЕНИЕ', uz: 'QAYNOQ TAKLIF' },
    showcase: { en: 'NEW IN', ru: 'НОВИНКА', uz: 'YANGILIK' },
    tip: { en: 'PRO TIP', ru: 'СОВЕТ', uz: 'MASLAHAT' },
    engagement: { en: 'YOUR TURN', ru: 'ВАШ ХОД', uz: 'SIZGA SAVOL' },
    announcement: { en: 'NEWS', ru: 'НОВОСТИ', uz: 'YANGILIK' }
  };
  const LAYOUT_OF = { promo: 'promo', showcase: 'promo', tip: 'point', engagement: 'cover', announcement: 'cover' };
  const STYLES = [null, 'gradient', 'dark', 'light', 'solid']; // null = brand default

  const cur = {
    type: 'promo', tone: 'bold', lang: 'en', size: '1080x1350',
    styleIdx: 0,
    slide: null, caption: '', ids: [], photo: null
  };
  let chips = {};

  function init() {
    const b = BR.store.brand;
    cur.type = BR.store.recall('post', 'type', 'promo');
    cur.tone = BR.store.recall('post', 'tone', b.tone);
    cur.lang = BR.store.recall('post', 'lang', b.lang);
    cur.size = BR.store.recall('post', 'size', '1080x1350');

    chips.type = BR.ui.chips($('postTypeChips'), BR.content.TYPES.map(t => ({ value: t, label: BR.content.TYPE_LABELS[t] })), cur.type, v => { cur.type = v; BR.store.remember('post', 'type', v); });
    chips.lang = BR.ui.chips($('postLangChips'), BR.content.LANGS.map(l => ({ value: l, label: BR.content.LANG_LABELS[l] })), cur.lang, v => { cur.lang = v; BR.store.remember('post', 'lang', v); });
    chips.tone = BR.ui.chips($('postToneChips'), BR.content.TONES.map(t => ({ value: t, label: BR.content.TONE_LABELS[t] })), cur.tone, v => { cur.tone = v; BR.store.remember('post', 'tone', v); });
    chips.size = BR.ui.chips($('postSizeChips'), [
      { value: '1080x1350', label: 'Portrait 4:5' },
      { value: '1080x1080', label: 'Square 1:1' },
      { value: '1080x1920', label: 'Story 9:16' }
    ], cur.size, v => { cur.size = v; BR.store.remember('post', 'size', v); render(); });

    $('postPhoto').addEventListener('change', async e => {
      const file = e.target.files[0];
      cur.photo = file ? await BR.ui.fileToDataURL(file, 1600) : null;
      if (cur.slide) { cur.slide.photo = cur.photo; render(); }
    });

    $('postGenerate').addEventListener('click', generate);
    $('postAI').addEventListener('click', generateAI);
    $('postRestyle').addEventListener('click', () => {
      cur.styleIdx = (cur.styleIdx + 1) % STYLES.length;
      render();
      BR.ui.toast('Style: ' + (STYLES[cur.styleIdx] || 'brand default'));
    });
    $('postEditText').addEventListener('click', () => {
      if (!cur.slide) return;
      BR.ui.editSlide(cur.slide, render);
    });
    $('postLike').addEventListener('click', () => feedback(1));
    $('postDislike').addEventListener('click', () => { feedback(-1); generate(); });
    $('postRecaption').addEventListener('click', recaption);
    $('postCopyCaption').addEventListener('click', () => BR.ui.copy($('postCaption').value));
    $('postDownload').addEventListener('click', download);
    $('postSave').addEventListener('click', saveToLibrary);

    generate();
  }

  function params() {
    return {
      type: cur.type, tone: cur.tone, lang: cur.lang,
      subject: $('postSubject').value.trim(),
      offer: $('postOffer').value.trim()
    };
  }

  function generate() {
    const p = params();
    const g = BR.content.generateCaption(p);
    cur.caption = g.text;
    cur.ids = g.ids;
    $('postCaption').value = g.text;

    const badge = (BADGES[p.type] || BADGES.promo)[p.lang] || BADGES.promo.en;
    // image headline: the subject if given, otherwise the caption's hook line
    let title = p.subject || g.text.split('\n')[0];
    title = title.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '').trim();
    if (title.length > 80) title = title.slice(0, 77) + '…';

    cur.slide = {
      layout: LAYOUT_OF[p.type] || 'promo',
      badge,
      title: title || BR.store.brand.name,
      body: p.offer || (p.type === 'tip' ? extractTipBody(g.text) : ''),
      photo: cur.photo,
      pageCount: 1, pageNum: 1, swipe: false
    };
    render();
  }

  function extractTipBody(caption) {
    // for tip posts, put the advice itself on the image
    const lines = caption.split('\n').filter(l => l.trim());
    return (lines[1] || '').slice(0, 180);
  }

  function recaption() {
    const p = params();
    const g = BR.content.generateCaption(p);
    cur.caption = g.text;
    cur.ids = g.ids;
    $('postCaption').value = g.text;
  }

  async function generateAI() {
    if (!BR.ai.hasKey()) { BR.ui.toast('Add your Claude API key in Brand & Taste first ✨'); return; }
    const btn = $('postAI');
    btn.disabled = true; btn.textContent = '✨ Thinking…';
    try {
      const p = params();
      const text = await BR.ai.caption(p);
      cur.caption = text;
      cur.ids = [];
      $('postCaption').value = text;
      if (!cur.slide) generate();
      BR.ui.toast('AI caption ready ✨');
    } catch (e) {
      BR.ui.toast('AI error: ' + (e.message === 'NO_KEY' ? 'no API key' : e.message));
    } finally {
      btn.disabled = false; btn.textContent = '✨ Generate with AI';
    }
  }

  function feedback(delta) {
    const styleId = 'style:' + (STYLES[cur.styleIdx] || BR.store.brand.designStyle);
    BR.store.tasteFeedback([...cur.ids, styleId, 'type:' + cur.type, 'tone:' + cur.tone], delta);
    BR.ui.toast(delta > 0 ? '👍 Got it — more like this' : '👎 Noted — I\'ll adjust');
  }

  function size() {
    const [w, h] = cur.size.split('x').map(Number);
    return { w, h };
  }

  async function render() {
    if (!cur.slide) return;
    const { w, h } = size();
    await BR.canvas.renderSlide($('postCanvas'), cur.slide, { w, h, style: STYLES[cur.styleIdx] });
  }

  async function download() {
    if (!cur.slide) return;
    await render();
    BR.canvas.downloadCanvas($('postCanvas'), `${BR.store.brand.name.toLowerCase().replace(/\s+/g, '-')}-post.png`);
    BR.ui.toast('⬇ Post image downloaded — caption is ready to copy');
  }

  function saveToLibrary() {
    if (!cur.slide) return;
    const slideCopy = { ...cur.slide, photo: null }; // photos are too big for localStorage
    BR.store.saveToLibrary({
      kind: 'post',
      title: cur.slide.title,
      caption: $('postCaption').value,
      data: { slide: slideCopy, size: cur.size, styleIdx: cur.styleIdx, type: cur.type, tone: cur.tone, lang: cur.lang }
    });
    BR.ui.toast('♥ Saved to library');
  }

  function load(item) {
    const d = item.data;
    cur.slide = { ...d.slide };
    cur.caption = item.caption;
    cur.size = d.size || '1080x1350';
    cur.styleIdx = d.styleIdx || 0;
    cur.ids = [];
    $('postCaption').value = item.caption;
    chips.size.set(cur.size);
    render();
  }

  BR.post = { init, load };
})();
