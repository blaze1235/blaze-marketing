# 🔥 BlazeRent Studio

Your personal content engine: create **ready-to-post Instagram posts, carousels and reels** for BlazeRent — with a brand memory that learns your taste over time.

No installs, no build step, no dependencies. One folder of static files.

## ▶️ Run it

**Option 1 — just open it:** double-click `index.html`.

**Option 2 — local server** (recommended for clipboard support):

```bash
npx serve .
# or
python3 -m http.server 8080
```

**Option 3 — deploy free** to Netlify / Vercel / GitHub Pages: it's a static site, drag the folder in and you're live.

## ✨ What it does

| Studio | Output |
|---|---|
| **Post Studio** | Branded 1080×1350 / 1080×1080 / story image (PNG) + caption + hashtags |
| **Carousel Studio** | Multi-slide carousel from ready-made packs, your own points, or AI — exported as a ZIP of PNGs + caption |
| **Reel Studio** | Shot-by-shot script (hook, scenes, on-screen text, voiceover, audio idea) **and** a rendered 1080×1920 video with your photos, Ken Burns motion and animated captions |
| **Planner** | One-click weekly content plan with idea → drafted → ready → posted tracking |
| **Library** | Save anything you love and reopen it later |

## 🧠 It remembers you

- **Brand Kit** — name, niche, city, logo, colors, typography, visual style, tone of voice, languages, hashtag bank. Set once in *Brand & Taste*; applied to everything automatically.
- **Taste memory** — hit 👍 / 👎 on anything generated. Liked hooks, packs, styles and tones get picked more often; disliked ones fade away. Watch the "taste memory" meter fill up in the sidebar.
- **Session memory** — every studio remembers your last-used type, tone, language and format.
- All data lives in your browser's localStorage. Use *Brand & Taste → Export/Import* to back it up or move machines.

## 🌍 Languages

Content generates in **English, Russian and Uzbek** — switch per-post with one tap.

## ✨ Optional AI power-up

The built-in template engine works fully offline. Paste a **Claude API key** in *Brand & Taste* to unlock unlimited AI-written captions, carousels and reel scripts on **any** topic (key stays in your browser, requests go directly to Anthropic).

## 📱 Posting workflow

1. Generate → tweak → **Download**.
2. **Copy caption** (hashtags included).
3. Post the PNG(s)/video + paste the caption. Done.

> Reel videos render as MP4 where the browser supports it (Safari, newer Chrome), otherwise WebM — drop a WebM into CapCut or any converter if Instagram complains, and add trending audio there.

## 🗂 Project structure

```
index.html        app shell
css/style.css     UI theme
js/store.js       state, persistence, taste memory
js/content.js     template engine (EN/RU/UZ captions, carousel packs, reel concepts)
js/canvas.js      slide renderer (brand-aware layouts)
js/zip.js         dependency-free ZIP writer for carousel export
js/ai.js          optional Claude API integration
js/post.js        Post Studio
js/carousel.js    Carousel Studio
js/reel.js        Reel Studio + video renderer
js/planner.js     weekly planner
js/app.js         navigation, dashboard, library, settings, onboarding
```
