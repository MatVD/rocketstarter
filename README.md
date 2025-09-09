# RocketStarter — README

## Overview

This repository is a Vite + React + TypeScript starter tailored for the RocketStarter project. It includes a modern frontend stack with Tailwind CSS and common libraries used across the app.

## Quickstart (local development)

Prerequisites: Node.js (16+ recommended), npm

1.  Fork the repository from GitHub and clone it locally

```bash
git clone https://github.com/YOUR_USERNAME/rocketstarter.git
cd rocketstarter
```

2.  Install dependencies

```bash
npm install
```

3.  Environment setup

You have to create a `.env` file in the root directory if your app requires environment variables. Copy from the example file if provided:

```bash
cp .env.example .env.local
```

4.  Start the dev server

```bash
npm run dev
```

Open http://localhost:5173 (default Vite port).

## Build & preview

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Useful scripts

- `npm run dev` — start Vite dev server
- `npm run build` — build for production (output: `dist/`)
- `npm run preview` — locally preview the production build
- `npm run lint` — run ESLint across the project

## Project structure (top-level)

- `src/` — source code (React components, pages, styles)
- `index.html` — app entry HTML
- `package.json` — scripts & dependencies
- `vite.config.ts` — Vite configuration

## Maintenance tips

- Keep dependencies up to date and run `npm audit` regularly.
- The build logs may warn about large chunks; consider code-splitting with dynamic imports or using `build.rollupOptions.output.manualChunks` in `vite.config.ts` to split heavy libraries.
- If you see a Browserslist warning during build, run:

```bash
npx update-browserslist-db@latest
```

## Contributing

Create issues and pull requests on the repository. Include a short description of the change and verification steps.

## Troubleshooting

- Build fails: confirm Node version and run `npm ci` to get a clean install.
- Dev server not starting: check for port conflicts or errors in the browser console.

## Contact / Support

For questions about this repository, open an issue or contact the maintainer.
