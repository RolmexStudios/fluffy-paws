# Brochure template A (standalone site)

This project was generated from the WaaS monorepo. It is a static Next.js brochure site.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see placeholder labels (`BrochureHero_1`, etc.) until you fill `content/blueprint.json`.

## Content

See [CONTENT.md](./CONTENT.md) for slot ids and JSON paths.

Put image URLs in `content/blueprint.json`. Run `npm run assets:localize` to copy remote `https://` images into `public/assets/` and rewrite those URLs to `/assets/...`.

## Deploy (Cloudflare Pages)

```bash
npm run build
```

Upload the `out/` directory to Cloudflare Pages, or connect this repo with build command `npm run build` and **output directory `out`**.

Do not set the deploy command to `npx wrangler deploy` / OpenNext Workers unless you remove `output: "export"` and adopt `@opennextjs/cloudflare`—this template is static-only.
