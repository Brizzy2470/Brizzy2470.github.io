# Persona Archive — OPEN CASE-style category transitions

This update adds the **same navy diagonal `PageTransition` wipe** used by the site's OPEN CASE buttons to the **PHOTOGRAPHY** and **GRAPHIC DESIGN** choices on `/archive`.

The category is changed under the wipe, and the wipe exits in the opposite direction to reveal the filtered gallery. The “× CLOSE FILE” button runs a matching wipe back to the category selector. Clicking an already-selected category just scrolls to that gallery.

## Install (recommended; preserves unrelated changes)

Extract this ZIP outside your repo. From your website's project root run:

```sh
python3 /path/to/archive_category_transition/install_category_transition.py . --check
python3 /path/to/archive_category_transition/install_category_transition.py .
python3 /path/to/archive_category_transition/install_category_transition.py . --verify
npm run build
npm run dev
```

On Windows PowerShell use `py -3` instead of `python3`.

The installer edits only `src/Archive.tsx` and `src/archive.css`, and backs up the originals to the **parent of the repository**. It can be run again without duplicating code. A `--check` run never modifies files.

## Manual installation

The ZIP also contains the complete updated `src/Archive.tsx` and `src/archive.css`. Replace those two files directly **only if you have not customized them** since the previous Vault update. Otherwise use the installer above.

## What stays unchanged

- Vault entry and exit animation, including the Windows reduced-motion workaround
- Image filtering, project tags, and photo lightbox
- Existing OPEN CASE animations and site-wide `PageTransition` styling
- All other page layouts

The category animation is GSAP-driven and does **not** skip itself when Windows Animation effects are disabled.
