#!/usr/bin/env python3
"""Add an OPEN CASE-style wipe when selecting Archive categories.

From the project root:
  python3 /path/to/install_category_transition.py . --check
  python3 /path/to/install_category_transition.py .
  python3 /path/to/install_category_transition.py . --verify

Does not change the vault transition or project data. Backs up existing files
outside the repository before modifying anything.
"""
from __future__ import annotations
import argparse
from datetime import datetime
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

IMPORT_OLD = 'import { useEffect, useMemo, useRef, useState } from "react";'
IMPORT_NEW = '''import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import PageTransition from "./components/PageTransition/PageTransition";'''
REF_OLD = '  const closeRef = useRef<HTMLButtonElement>(null);'
REF_NEW = '''  const closeRef = useRef<HTMLButtonElement>(null);
  const fileTransitionRef = useRef<HTMLDivElement>(null);
  const fileTransitionLabelRef = useRef<HTMLSpanElement>(null);
  const fileTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const fileTransitionBusyRef = useRef(false);'''
LOGIC = '''  // Uses the same animated diagonal panel as WORK -> OPEN CASE.
  // Keep it on the Archive page so it survives a category query-string change.
  const changeCategory = (category: Category | null) => {
    if (fileTransitionBusyRef.current) return;

    if (selected?.id === category || (!selected && category === null)) {
      if (category) resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const curtain = fileTransitionRef.current;
    const label = fileTransitionLabelRef.current;
    const next = collections.find((item) => item.id === category);

    if (!curtain) {
      setLightboxIndex(null);
      setSearchParams(category ? { category } : {});
      return;
    }

    fileTransitionBusyRef.current = true;
    if (label) label.textContent = next ? next.label : "CLOSE FILE";

    fileTimelineRef.current?.kill();
    gsap.killTweensOf(curtain);
    gsap.set(curtain, { display: "block", xPercent: -120 });

    fileTimelineRef.current = gsap.timeline({
      onComplete: () => {
        gsap.set(curtain, { display: "none", xPercent: -120 });
        fileTransitionBusyRef.current = false;
        fileTimelineRef.current = null;
      },
    })
      .to(curtain, { xPercent: 0, duration: 0.45, ease: "power4.in" })
      .add(() => {
        // Update the gallery while the transition covers the viewport.
        flushSync(() => {
          setLightboxIndex(null);
          setSearchParams(category ? { category } : {});
        });

        if (category) {
          resultsRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      })
      .to(curtain, { xPercent: 120, duration: 0.55, ease: "power4.out" }, ">+=0.09");
  };

  // Direct links and browser back/forward still scroll to the correct section.
  // During the wipe, changeCategory handles the scroll before revealing the new gallery.
  useLayoutEffect(() => {
    if (fileTransitionBusyRef.current) return;
    if (selected) resultsRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
    else window.scrollTo({ top: 0, behavior: "auto" });
  }, [selected?.id]);

  useEffect(() => () => {
    fileTimelineRef.current?.kill();
  }, []);

'''
CSS_ADDITION = '''\n/* Category file selection: reuse the same diagonal OPEN CASE panel. */
.archiveFileTransition .pageTransitionText {
  width: min(88vw, 1200px);
  text-align: center;
  white-space: normal;
  font-size: clamp(3rem, 9vw, 9rem);
  overflow-wrap: normal;
  line-height: 0.85;
}
@media (max-width: 620px) {
  .archiveFileTransition .pageTransitionText {
    width: 90vw;
    font-size: clamp(2.5rem, 10vw, 4.5rem);
    text-shadow: 4px 4px 0 var(--ink);
  }
}
'''


def once(src: str, old: str, new: str, label: str) -> str:
    if src.count(old) != 1:
        raise ValueError(f'Expected exactly one {label}, found {src.count(old)}. No files have been changed.')
    return src.replace(old, new, 1)


def update_tsx(text: str) -> str:
    if 'className="archiveFileTransition"' in text:
        return text
    if 'useVaultTransition' not in text:
        raise ValueError('Vault-aware Archive.tsx not found. Install the previous Archive and Vault updates first.')
    text = once(text, IMPORT_OLD, IMPORT_NEW, 'React import')
    text = once(text, REF_OLD, REF_NEW, 'lightbox close ref')
    start = text.find('  const selectCategory = (category: Category) => {')
    end = text.find('  useEffect(() => {\n    if (lightboxIndex === null', start)
    if start == -1 or end == -1 or end <= start:
        raise ValueError('Expected Archive selection logic not found. No files have been changed.')
    text = text[:start] + LOGIC + text[end:]
    text = once(
        text,
        '  return (\n    <main className="archivePage">',
        '  return (\n    <>\n      <div className="archiveFileTransition">\n'
        '        <PageTransition\n'
        '          ref={fileTransitionRef}\n'
        '          textRef={fileTransitionLabelRef}\n'
        '          label="OPEN FILE"\n'
        '        />\n'
        '      </div>\n'
        '      <main className="archivePage">',
        'Archive component root',
    )
    text = once(text, 'onClick={() => selectCategory(category.id)}', 'onClick={() => changeCategory(category.id)}', 'category click')
    text = once(text, 'onClick={() => setSearchParams({})}>× CLOSE FILE', 'onClick={() => changeCategory(null)}>× CLOSE FILE', 'close file button')
    last = text.rfind('    </main>\n  );')
    if last == -1:
        raise ValueError('Expected ending for Archive component not found. No files have been changed.')
    text = text[:last] + text[last:].replace('    </main>\n  );', '    </main>\n    </>\n  );', 1)
    return text


def update_css(text: str) -> str:
    if '.archiveFileTransition .pageTransitionText' in text:
        return text
    return text.rstrip() + '\n' + CSS_ADDITION


def verify(tsx: str, css: str) -> list[str]:
    checks = {
        'uses existing PageTransition component': 'import PageTransition from "./components/PageTransition/PageTransition";' in tsx,
        'Photography and Graphic Design use animated selection': 'changeCategory(category.id)' in tsx,
        'gallery switches while wipe is covering screen': 'flushSync(() =>' in tsx and '.to(curtain, { xPercent: 120' in tsx,
        'Close File uses reverse category selection': 'changeCategory(null)' in tsx,
        'existing vault return navigation preserved': 'returnToWork();' in tsx,
        'responsive transition text styling installed': '.archiveFileTransition .pageTransitionText' in css,
    }
    for description, ok in checks.items():
        print(('OK  ' if ok else 'FAIL') + description)
    return [description for description, ok in checks.items() if not ok]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('repo', type=Path, help='Path to the website repository')
    modes = parser.add_mutually_exclusive_group()
    modes.add_argument('--check', action='store_true', help='Check compatibility without changing files')
    modes.add_argument('--verify', action='store_true', help='Verify installation without changing files')
    args = parser.parse_args()
    repo = args.repo.resolve()
    tsx_path, css_path = repo/'src/Archive.tsx', repo/'src/archive.css'
    if not tsx_path.is_file() or not css_path.is_file():
        parser.error('Expected src/Archive.tsx and src/archive.css in the selected repository')
    existing_tsx, existing_css = tsx_path.read_text(), css_path.read_text()
    if args.verify:
        failed = verify(existing_tsx, existing_css)
        raise SystemExit(1 if failed else 0)
    try:
        new_tsx, new_css = update_tsx(existing_tsx), update_css(existing_css)
    except ValueError as exc:
        parser.error(str(exc))
    print('Compatible with current source: YES')
    if args.check:
        print('Check only: no files modified')
        return
    if existing_tsx == new_tsx and existing_css == new_css:
        print('Already installed; no changes needed')
        return
    backup = repo.parent / f'archive_category_backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.zip'
    with ZipFile(backup, 'w', compression=ZIP_DEFLATED) as z:
        z.writestr('src/Archive.tsx', existing_tsx)
        z.writestr('src/archive.css', existing_css)
    tsx_path.write_text(new_tsx)
    css_path.write_text(new_css)
    print(f'Installed. Backup is outside the repository: {backup}')
    failed = verify(new_tsx, new_css)
    raise SystemExit(1 if failed else 0)

if __name__ == '__main__':
    main()
