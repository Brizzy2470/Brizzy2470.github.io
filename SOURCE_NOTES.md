# Source Notes

This package was prepared on September 10, 2026 from the current public `main` branch structure of:

`Brizzy2470/Brizzy2470.github.io`

The existing Home / Work / About / Contact / Project Detail structure, GSAP motion approach, Vite/React setup, project data pattern, and GitHub Pages deployment approach were retained as the baseline for this owner-friendly version.

## One binary-asset note

The build environment used to prepare this ZIP could read the repository's source code but could not directly copy the repository's binary `src/images/profile.jpg` into the package. To avoid breaking the landing page, `src/data/site.ts` is configured to fall back to that exact image on the original GitHub repository until a local replacement is added at:

`public/images/profile/profile.jpg`

Once that local file exists, it is used automatically and the fallback is no longer needed during normal use.
