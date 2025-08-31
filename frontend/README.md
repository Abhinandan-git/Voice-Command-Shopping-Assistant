# Voice Command Shopping Assistant (Next.js 14, App Router)

A voice-first shopping list manager with smart suggestions, multilingual voice input, and voice-activated product search.

## Features

- 🎙️ **Voice Input (Web Speech API)** — add/remove/modify items, list and voice search
- 🌐 **Multilingual** — easily switch recognition language (en-US, en-IN, hi-IN, es-ES, fr-FR)
- 🧠 **NLP** — simple rule-based parser for add/remove/modify/search/quantity
- 🧾 **Shopping List** — local persistence via `localStorage`, categories & quantities
- 💡 **Smart Suggestions** — based on your recent history and current seasonal produce
- 🔎 **Voice Search** — local product dataset with filters (`under $X`, `by BRAND`)
- ♿ **A11y** — semantic buttons/labels, keyboard-friendly
- 🚀 **Ready for Vercel** — zero config deploy

## Local Development

```bash
pnpm i   # or npm i / yarn
pnpm dev # http://localhost:3000
```

## Deploy to Vercel

- Push to GitHub, import in Vercel, and deploy.
- No env vars required by default.

> Optional: If you want cloud-based NLP or embeddings, add your API keys as Vercel Environment Variables and extend `lib/nlp.ts` or `/app/api/*` routes.

## Tech

- Next.js 14 (App Router), TypeScript, Tailwind, Zustand

## 200-word approach

This app focuses on **reliability** and **low-latency** by keeping the core loop entirely in the browser. Voice input uses the Web Speech API with a minimal, resilient UI. A **rule-based NLP** parser (`lib/nlp.ts`) translates common phrasings into intents: add, remove, modify, list, and search; it extracts quantities from numerals and words (e.g., “two”). Smart suggestions combine **recency** (user history stored locally) with **seasonal items** keyed to the current month. Items are auto-categorized using a lightweight map and rendered in a clear, touch-friendly list with quantity controls. Voice search queries a bundled product dataset via a **serverless API route** (`/api/search`) with brand and price filters (e.g., “under $5”). The state layer uses **Zustand** and persists to `localStorage` for instant, offline-friendly behavior. The UI employs Tailwind for a clean, mobile-first layout and accessibility-first semantics. The project is **production ready for Vercel** with strict TypeScript, sensible headers, and no required secrets. It is easy to extend with real catalogs, sales feeds, or LLM-powered suggestions, while keeping the default stack simple, dependency-light, and fast.
