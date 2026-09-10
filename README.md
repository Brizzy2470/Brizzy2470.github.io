# Brandon Portfolio

Persona-inspired creative portfolio for Brandon Phan.

This version is based on the current `main` structure of `Brizzy2470/Brizzy2470.github.io`, with owner-friendly content files and automatic media galleries added on top.

## For Brandon / normal website updates

Read **[OWNER_GUIDE.md](./OWNER_GUIDE.md)** first.

The short version:

- Website text and contact information: `src/data/site.ts`
- Projects: `src/data/projects.ts`
- Photography: drop images into `src/media/galleries/<gallery-name>/`
- Project images: drop images into `src/media/projects/<project-slug>/`

## Developer setup

Requires Node 24.

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Deployment

The repository contains a GitHub Pages workflow at:

`.github/workflows/deploy.yml`

Pushing to `main` builds and deploys the site automatically.

## Media behavior

Gallery and project images are discovered at build time with Vite's `import.meta.glob`. Supported formats:

- JPG / JPEG
- PNG
- WebP
- AVIF

The photo archive uses a masonry layout, lazy-loaded images, and a fullscreen lightbox with keyboard and swipe navigation.
