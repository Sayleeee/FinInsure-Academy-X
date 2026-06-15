# FinInsure Academy

An academy/portal to onboard insurance salespeople and brokers into a consortium of finance and insurance products.

This is a **static single-page application** built with **Vite + React 19 + TypeScript** and styled with **Tailwind CSS v4**. Routing is client-side (`react-router-dom`). All data is currently mocked in-app (React context) — there is **no backend and no required API keys** to run or deploy it.

## Tech stack

- Vite 6 (build tool / dev server)
- React 19 + react-router-dom 7
- TypeScript 5.8
- Tailwind CSS v4
- recharts, framer-motion / motion, lucide-react

## Run locally

**Prerequisite:** Node.js 18+ (developed/tested on Node 20–25).

```bash
npm install      # install dependencies
npm run dev      # start dev server at http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build → ./dist
npm run preview  # serve the production build locally (http://localhost:4173)
npm run lint     # TypeScript type-check (tsc --noEmit)
```

## Deploy to Vercel

The repo includes a `vercel.json` preconfigured for this app.

1. Push this directory to a Git repo (GitHub/GitLab/Bitbucket) **or** use the Vercel CLI (`vercel`).
2. Import the project into Vercel. Settings are auto-detected:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Install command:** `npm install` (or `npm ci`)
3. Deploy. No environment variables are required.

The `rewrites` rule in `vercel.json` sends all routes to `index.html` so client-side
routes (e.g. `/crm`, `/customers`) work on direct navigation and page refresh.

### Other static hosts (Netlify, Cloudflare Pages, S3, etc.)

Run `npm run build` and serve the `dist/` folder. Configure an **SPA fallback**
so every path serves `index.html` (equivalent to the Vercel rewrite above).

## Notes

- `.env.example` documents an optional `GEMINI_API_KEY`, a leftover from the original
  AI Studio template. **It is not used anywhere in the current source code** and is not
  needed to build, run, or deploy. No real secret is included in this package.
- The build emits a single ~1 MB JS bundle (≈305 KB gzipped). This is fine for an
  internal portal; code-splitting can be added later if needed.
