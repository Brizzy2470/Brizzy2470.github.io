#!/usr/bin/env python3
"""Add animated vault-door page transitions to the existing Persona Archive page.

Run from a checked-out repository (after the Category Archive update):
    python3 /path/to/apply_vault_transition.py .

This script validates expected existing code and backs up files before writing.
It deliberately does not modify project data, images, or the Archive layout/CSS.
"""
from __future__ import annotations

import argparse
from datetime import datetime
from pathlib import Path
import sys
from zipfile import ZipFile, ZIP_DEFLATED


COMPONENT = Path("src/components/VaultTransition/VaultTransition.tsx")
STYLES = Path("src/components/VaultTransition/vaultTransition.css")


def replace_once(content: str, old: str, new: str, filename: str) -> str:
    count = content.count(old)
    if count != 1:
        raise ValueError(f"Expected one match in {filename}, found {count}: {old[:85]!r}")
    return content.replace(old, new, 1)


def update_app(s: str) -> str:
    name = "src/App.tsx"
    if 'path="/archive"' not in s:
        raise ValueError("The Archive page is not installed. Install the previous archive_page_update first.")
    s = replace_once(s,
        'import Archive from "./Archive";',
        'import Archive from "./Archive";\nimport { VaultTransitionProvider } from "./components/VaultTransition/VaultTransition";', name)
    s = replace_once(s, '    <Routes>', '    <VaultTransitionProvider>\n      <Routes>', name)
    s = replace_once(s, '    </Routes>', '      </Routes>\n    </VaultTransitionProvider>', name)
    return s


def update_home(s: str) -> str:
    name = "src/Home.tsx"
    s = replace_once(s,
        'import PageTransition from "./components/PageTransition/PageTransition";',
        'import PageTransition from "./components/PageTransition/PageTransition";\nimport { useVaultTransition } from "./components/VaultTransition/VaultTransition";', name)
    s = replace_once(s, 'onClick={() => navigate("/archive")}', 'onClick={enterArchive}', name)
    s = replace_once(s,
        '  const location = useLocation();',
        '  const location = useLocation();\n  const { enterArchive } = useVaultTransition();', name)
    # The Archive CTA was the only navigation handled by Home's useNavigate.
    if '  const navigate = useNavigate();' in s and s.count('navigate(') == 0:
        s = replace_once(s, '  const navigate = useNavigate();\n', '', name)
        if 'useLocation, useNavigate' in s:
            s = replace_once(s, 'useLocation, useNavigate', 'useLocation', name)
        elif 'useNavigate, useLocation' in s:
            s = replace_once(s, 'useNavigate, useLocation', 'useLocation', name)
        else:
            raise ValueError("Home.tsx has an unexpected useNavigate import; not writing.")
    return s


def update_work(s: str) -> str:
    name = "src/Work.tsx"
    s = replace_once(s,
        'import PageTransition from "./components/PageTransition/PageTransition";',
        'import PageTransition from "./components/PageTransition/PageTransition";\nimport { useVaultTransition } from "./components/VaultTransition/VaultTransition";', name)
    s = replace_once(s,
        '  const navigate = useNavigate();',
        '  const navigate = useNavigate();\n  const { enterArchive } = useVaultTransition();', name)
    s = replace_once(s, 'onClick={() => navigate("/archive")}', 'onClick={enterArchive}', name)
    return s


def update_archive(s: str) -> str:
    name = "src/Archive.tsx"
    s = replace_once(s,
        'import { Link, useSearchParams } from "react-router-dom";',
        'import { Link, useSearchParams } from "react-router-dom";\nimport { useVaultTransition } from "./components/VaultTransition/VaultTransition";', name)
    s = replace_once(s,
        'export default function Archive() {',
        'export default function Archive() {\n  const { returnToWork } = useVaultTransition();', name)
    s = replace_once(s,
        '<Link className="archiveBack" to="/#work">',
        '<Link className="archiveBack" to="/#work" onClick={(event) => { event.preventDefault(); returnToWork(); }}>', name)
    s = replace_once(s,
        '<Link to="/#work">← RETURN TO WORK</Link>',
        '<Link to="/#work" onClick={(event) => { event.preventDefault(); returnToWork(); }}>← RETURN TO WORK</Link>', name)
    return s


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("repository", type=Path, nargs="?", default=Path.cwd())
    parser.add_argument("--check", action="store_true", help="Check compatibility without changes")
    args = parser.parse_args()
    root = args.repository.resolve()
    pkg = Path(__file__).resolve().parent
    transforms = {
        Path("src/App.tsx"): update_app,
        Path("src/Home.tsx"): update_home,
        Path("src/Work.tsx"): update_work,
        Path("src/Archive.tsx"): update_archive,
    }
    changes: dict[Path, str] = {}
    backups: dict[Path, str] = {}
    try:
        if not (root / "src/data/projects.ts").exists():
            raise ValueError(f"Not a Persona Portfolio repository: {root}")
        if (root / COMPONENT).exists():
            raise ValueError(f"{COMPONENT} already exists. Transition may already be installed; refusing to overwrite.")
        for relative, func in transforms.items():
            before = (root / relative).read_text(encoding="utf-8")
            after = func(before)
            if before != after:
                backups[relative] = before
                changes[relative] = after
        for relative in (COMPONENT, STYLES):
            if (root / relative).exists():
                raise ValueError(f"{relative} already exists; refusing to overwrite.")
            changes[relative] = (pkg / relative).read_text(encoding="utf-8")
    except (OSError, ValueError) as exc:
        print(f"Nothing changed: {exc}", file=sys.stderr)
        return 1

    print("Files to update/create:\n" + "\n".join(f"  {p}" for p in changes))
    if args.check:
        print("Compatibility check passed. No changes applied.")
        return 0

    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = root / f"vault_transition_backup_{stamp}.zip"
    with ZipFile(backup_path, "w", ZIP_DEFLATED) as zipfile:
        for relative, before in backups.items():
            zipfile.writestr(str(relative), before)
    for relative, after in changes.items():
        dest = root / relative
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(after, encoding="utf-8")

    print(f"Vault transition installed. Backup: {backup_path.name}")
    print("Run `npm run build` and `npm run dev` to verify.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
