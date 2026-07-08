/* BlazeRent Studio — store.js
 * Persistent state: brand kit, taste memory, library, planner, settings.
 * Everything lives in localStorage so the app "remembers" the user.
 */
window.BR = window.BR || {};

(function () {
  const LS_KEY = 'blazerent-studio-v1';
  const SCHEMA_VERSION = 2; // bump when defaults change in a way old saves must adopt

  const DEFAULTS = {
    schemaVersion: SCHEMA_VERSION,
    onboarded: false,
    brand: {
      name: 'BlazeRent',
      niche: 'gaming',          // gaming | car | apartment | equipment | generic
      tagline: '',
      city: '',
      handle: '@blazerent_bot',
      phone: '',
      colors: {
        primary: '#2447D6',
        dark: '#04081C',
        accent: '#FFFFFF',
        light: '#EEF2FF'
      },
      logo: null,              // dataURL
      font: 'bold',            // bold | clean | serif | mono
      designStyle: 'esports',  // esports | gradient | dark | light | solid
      lang: 'en',              // en | ru | uz
      tone: 'bold',            // bold | friendly | luxury | playful
      emoji: 2,                // 0..3
      hashtags: ''
    },
    taste: {
      scores: {},              // templateId -> net score (likes - dislikes)
      likes: 0,
      dislikes: 0
    },
    library: [],               // {id, kind, title, caption, data, createdAt}
    planner: [],               // {id, day, type, title, status}
    settings: { apiKey: '', groqKey: '', aiProvider: 'groq' },
    lastUsed: {}               // per-studio UI memory (type, tone, lang...)
  };

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return structuredClone(DEFAULTS);
      const parsed = JSON.parse(raw);
      // deep-merge onto defaults so new fields appear after upgrades
      const merged = merge(structuredClone(DEFAULTS), parsed);
      if (!parsed.schemaVersion || parsed.schemaVersion < SCHEMA_VERSION) {
        // One-time migration: saves made before the CS2/navy rebrand baked in the
        // old car-rental niche and orange palette. Force the new brand defaults
        // so the rebrand actually takes effect instead of being silently overridden.
        merged.brand.niche = DEFAULTS.brand.niche;
        merged.brand.colors = structuredClone(DEFAULTS.brand.colors);
        merged.brand.designStyle = DEFAULTS.brand.designStyle;
        merged.schemaVersion = SCHEMA_VERSION;
        localStorage.setItem(LS_KEY, JSON.stringify(merged)); // persist immediately, don't wait for the next save()
        return merged;
      }
      merged.schemaVersion = SCHEMA_VERSION;
      return merged;
    } catch (e) {
      console.warn('store: failed to load, using defaults', e);
      return structuredClone(DEFAULTS);
    }
  }

  function merge(base, over) {
    for (const k in over) {
      if (over[k] && typeof over[k] === 'object' && !Array.isArray(over[k]) &&
          base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) {
        merge(base[k], over[k]);
      } else {
        base[k] = over[k];
      }
    }
    return base;
  }

  function save() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch (e) {
      // Most likely quota (big logo / many photos saved). Tell the user once.
      console.warn('store: save failed', e);
      if (BR.ui && BR.ui.toast) BR.ui.toast('⚠ Storage full — try a smaller logo or clear the library');
    }
    document.dispatchEvent(new CustomEvent('br:statechange'));
  }

  /* ---------- taste memory ----------
   * Every generated piece carries the template ids that produced it.
   * Like  -> +1 to each id.  Dislike -> -1.
   * pickWeighted() then favors what the user loves.
   */
  function tasteScore(id) {
    return state.taste.scores[id] || 0;
  }

  function tasteFeedback(ids, delta) {
    (ids || []).forEach(id => {
      if (!id) return;
      state.taste.scores[id] = (state.taste.scores[id] || 0) + delta;
    });
    if (delta > 0) state.taste.likes++;
    else state.taste.dislikes++;
    save();
  }

  function tasteWeight(id) {
    // score 0 -> weight 1; each like +60%; dislikes shrink but never kill a template
    const s = tasteScore(id);
    return Math.max(0.12, 1 + s * 0.6);
  }

  function pickWeighted(items, idFn) {
    if (!items || !items.length) return null;
    const weights = items.map(it => tasteWeight(idFn(it)));
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < items.length; i++) {
      r -= weights[i];
      if (r <= 0) return items[i];
    }
    return items[items.length - 1];
  }

  function tasteSignals() {
    return state.taste.likes + state.taste.dislikes;
  }

  function resetTaste() {
    state.taste = { scores: {}, likes: 0, dislikes: 0 };
    save();
  }

  /* ---------- library ---------- */
  function saveToLibrary(item) {
    item.id = 'lib_' + Date.now() + '_' + Math.floor(Math.random() * 1e4);
    item.createdAt = new Date().toISOString();
    state.library.unshift(item);
    // keep the library bounded so localStorage doesn't blow up
    if (state.library.length > 60) state.library.length = 60;
    save();
    return item.id;
  }

  function removeFromLibrary(id) {
    state.library = state.library.filter(i => i.id !== id);
    save();
  }

  /* ---------- planner ---------- */
  function setPlanner(items) { state.planner = items; save(); }

  /* ---------- misc ---------- */
  function remember(studio, key, val) {
    state.lastUsed[studio] = state.lastUsed[studio] || {};
    state.lastUsed[studio][key] = val;
    save();
  }
  function recall(studio, key, fallback) {
    return (state.lastUsed[studio] || {})[key] ?? fallback;
  }

  function exportAll() {
    return JSON.stringify(state, null, 2);
  }
  function importAll(json) {
    const parsed = JSON.parse(json); // throws on bad input; caller handles
    state = merge(structuredClone(DEFAULTS), parsed);
    save();
  }

  BR.store = {
    get state() { return state; },
    get brand() { return state.brand; },
    save,
    tasteFeedback, tasteWeight, pickWeighted, tasteSignals, resetTaste, tasteScore,
    saveToLibrary, removeFromLibrary,
    setPlanner,
    remember, recall,
    exportAll, importAll
  };
})();
