/* BlazeRent Studio — ai.js
 * Optional Claude API power-up. When the user pastes an API key in Settings,
 * captions / carousels / reel scripts can be generated on ANY topic.
 * Without a key the template engine (content.js) does everything offline.
 */
window.BR = window.BR || {};

(function () {
  const API_URL = 'https://api.anthropic.com/v1/messages';
  const MODEL = 'claude-sonnet-5';

  function hasKey() {
    return !!(BR.store.state.settings.apiKey || '').trim();
  }

  function brandBrief() {
    const b = BR.store.brand;
    const nicheNames = { car: 'car rental', apartment: 'apartment / short-term property rental', equipment: 'equipment rental', generic: 'rental business' };
    const langNames = { en: 'English', ru: 'Russian', uz: 'Uzbek' };
    return [
      `Brand: ${b.name}`,
      `Business: ${nicheNames[b.niche] || 'rental'}`,
      b.city ? `City: ${b.city}` : '',
      b.handle ? `Instagram: ${b.handle}` : '',
      b.phone ? `Contact: ${b.phone}` : '',
      b.tagline ? `Tagline: ${b.tagline}` : '',
      `Tone of voice: ${b.tone}`,
      `Emoji usage: ${['none', 'minimal', 'moderate', 'heavy'][b.emoji] || 'moderate'}`,
      `Write in: ${langNames[b.lang] || 'English'}`
    ].filter(Boolean).join('\n');
  }

  async function ask(system, user, maxTokens = 1200) {
    const key = (BR.store.state.settings.apiKey || '').trim();
    if (!key) throw new Error('NO_KEY');
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        system,
        messages: [{ role: 'user', content: user }]
      })
    });
    if (!res.ok) {
      const err = await res.text().catch(() => '');
      throw new Error(`API ${res.status}: ${err.slice(0, 200)}`);
    }
    const data = await res.json();
    return (data.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n').trim();
  }

  /** AI caption for the Post studio. Returns plain text. */
  async function caption({ type, subject, offer, lang }) {
    const langNames = { en: 'English', ru: 'Russian', uz: 'Uzbek' };
    const system = `You are a top-tier social media copywriter for small rental businesses. Write scroll-stopping Instagram captions. Follow the brand brief exactly. Output ONLY the caption text, no preamble, no quotes, no markdown.`;
    const user = `${brandBrief()}\n\nWrite ONE Instagram ${type} caption in ${langNames[lang] || 'English'}.\nSubject: ${subject || 'our rental service'}\n${offer ? 'Offer to mention: ' + offer : ''}\nStructure: strong hook line, short persuasive body (2-4 sentences), clear call to action, then 10-15 relevant hashtags on the last line.`;
    return ask(system, user, 800);
  }

  /** AI carousel: returns {title, slides:[{title, body}], caption} parsed from JSON. */
  async function carousel({ topic, lang }) {
    const langNames = { en: 'English', ru: 'Russian', uz: 'Uzbek' };
    const system = `You are a social media strategist for rental businesses. You design Instagram carousels that get saved and shared. Respond with VALID JSON only — no markdown fences, no commentary.`;
    const user = `${brandBrief()}\n\nDesign an Instagram carousel in ${langNames[lang] || 'English'} on the topic: "${topic}".\nReturn JSON exactly in this shape:\n{"title": "cover slide title (max 8 words)", "badge": "short cover label like SAVE THIS", "slides": [{"title": "slide headline (max 7 words)", "body": "1-2 punchy sentences"}], "ctaTitle": "final slide title", "ctaBody": "final slide call to action mentioning the brand handle", "caption": "post caption with hook + 3 lines + CTA + 10 hashtags"}\nUse 4-6 content slides.`;
    const raw = await ask(system, user, 1600);
    return JSON.parse(raw.replace(/^```json?\s*/i, '').replace(/```\s*$/, ''));
  }

  /** AI reel script: returns {title, format, audio, scenes:[{shot,onscreen,voice}], caption}. */
  async function reel({ topic, lang }) {
    const langNames = { en: 'English', ru: 'Russian', uz: 'Uzbek' };
    const system = `You are a short-form video director for rental businesses. You write reels that hook in the first second. Respond with VALID JSON only — no markdown fences, no commentary.`;
    const user = `${brandBrief()}\n\nWrite an Instagram Reel script in ${langNames[lang] || 'English'} on the topic: "${topic}".\nReturn JSON exactly in this shape:\n{"title": "reel concept name", "format": "format description", "audio": "audio suggestion", "scenes": [{"shot": "what to film", "onscreen": "on-screen text overlay (short!)", "voice": "voiceover line or empty string"}], "caption": "post caption with hook + CTA + 10 hashtags"}\nUse 4-6 scenes. First scene must be a hard hook.`;
    const raw = await ask(system, user, 1600);
    return JSON.parse(raw.replace(/^```json?\s*/i, '').replace(/```\s*$/, ''));
  }

  BR.ai = { hasKey, caption, carousel, reel };
})();
