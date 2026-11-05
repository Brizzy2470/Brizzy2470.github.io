# Persona Portfolio — Vault Door Transition

Adds a cinematic, two-panel vault animation to the category-based Archive page.

## How it works

- **ENTER THE ARCHIVE** on the landing page and under Work: steel doors fill the screen, the locking wheel rotates, navigation to `/archive` occurs while the doors are shut, then the doors slide apart to reveal the Archive.
- **BACK TO WORK** / **RETURN TO WORK** on the Archive page: doors slide shut and lock before returning to `/#work`.
- Supports mobile screens, prevents accidental double clicks, and skips the animation if the visitor enables **Reduce Motion**.
- Does not change the Archive layout, existing galleries, project images, tags, or styling.

## Installation

**Install the category-based Archive page update first**, if you haven't already.

1. Extract the ZIP somewhere outside the repository (for example, `~/Downloads/vault_transition_update`).
2. Open Terminal in the `Brizzy2470.github.io` repository.
3. Run:

```bash
python3 ~/Downloads/vault_transition_update/apply_vault_transition.py . --check
python3 ~/Downloads/vault_transition_update/apply_vault_transition.py .
npm run build
npm run dev
```

On Windows PowerShell, use `py -3` instead of `python3`.

The installer expects the previous Archive page structure and will stop without making changes if it detects unexpected source differences. It backs up your previous edited files to `vault_transition_backup_*.zip` in the repository root. **Don't commit that backup ZIP**.

## Files

- **New:** `src/components/VaultTransition/VaultTransition.tsx` — React Router-persistent animation controller (GSAP).
- **New:** `src/components/VaultTransition/vaultTransition.css` — vault artwork made entirely with CSS, no external assets.
- **Edited by installer:** `src/App.tsx`, `src/Home.tsx`, `src/Work.tsx`, `src/Archive.tsx` — connect the existing entry and return buttons to the animation.

## Deployment

```bash
git status
git add src/App.tsx src/Home.tsx src/Work.tsx src/Archive.tsx src/components/VaultTransition/
git commit -m "Add vault door transitions for Archive navigation"
git push origin main
```

This package has not been pushed to GitHub.
