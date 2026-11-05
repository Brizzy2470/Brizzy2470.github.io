import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import PageTransition from "./components/PageTransition/PageTransition";
import { Link, useSearchParams } from "react-router-dom";
import { useVaultTransition } from "./components/VaultTransition/VaultTransition";
import { getProjectImages } from "./data/media";
import { projects } from "./data/projects";
import "./archive.css";

type Category = "photography" | "graphic-design";

type ArchiveImage = {
  src: string;
  projectTitle: string;
  projectNumber: string;
  projectSlug: string;
  imageNumber: number;
};

const categories: { id: Category; label: string; number: string; description: string }[] = [
  {
    id: "photography",
    label: "PHOTOGRAPHY",
    number: "01",
    description: "FRAMES, LIGHT, AND THE MOMENTS BETWEEN.",
  },
  {
    id: "graphic-design",
    label: "GRAPHIC DESIGN",
    number: "02",
    description: "VISUAL SYSTEMS, EXPERIMENTS, AND IDEAS.",
  },
];

const normalizeTag = (tag: string) =>
  tag.trim().toLowerCase().replace(/[-_]+/g, " ").replace(/\s+/g, " ");

// Source of truth: project.tags and src/media/projects/<slug>/.
// Images are collected once, without duplicating an explicit cover image.
const collections = categories.map((category) => {
  const matchingProjects = projects.filter((project) =>
    project.tags.some((tag) => normalizeTag(tag) === normalizeTag(category.label)),
  );

  const images: ArchiveImage[] = matchingProjects.flatMap((project) => {
    const sources = Array.from(
      new Set([
        ...(project.coverImage ? [project.coverImage] : []),
        ...getProjectImages(project.slug),
      ]),
    );

    return sources.map((src, imageIndex) => ({
      src,
      projectTitle: project.title.join(" "),
      projectNumber: project.number,
      projectSlug: project.slug,
      imageNumber: imageIndex + 1,
    }));
  });

  return { ...category, projectCount: matchingProjects.length, images };
});

export default function Archive() {
  const { returnToWork } = useVaultTransition();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const selected = collections.find((category) => category.id === categoryParam);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const fileTransitionRef = useRef<HTMLDivElement>(null);
  const fileTransitionLabelRef = useRef<HTMLSpanElement>(null);
  const fileTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const fileTransitionBusyRef = useRef(false);

  const imageCount = selected?.images.length ?? 0;
  const activeImage =
    selected && lightboxIndex !== null ? selected.images[lightboxIndex] : undefined;

  const galleryCaption = useMemo(() => {
    if (!selected) return "SELECT A CATEGORY TO OPEN ITS FILES.";
    return `${String(selected.images.length).padStart(2, "0")} IMAGES / ${String(
      selected.projectCount,
    ).padStart(2, "0")} PROJECTS`;
  }, [selected]);

  // Uses the same animated diagonal panel as WORK -> OPEN CASE.
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

  useEffect(() => {
    if (lightboxIndex === null || !selected || imageCount === 0) return;
    const originalOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") {
        setLightboxIndex((current) => (current === null ? null : (current + 1) % imageCount));
      }
      if (event.key === "ArrowLeft") {
        setLightboxIndex((current) =>
          current === null ? null : (current - 1 + imageCount) % imageCount,
        );
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [lightboxIndex !== null, selected?.id, imageCount]);

  return (
    <>
      <div className="archiveFileTransition">
        <PageTransition
          ref={fileTransitionRef}
          textRef={fileTransitionLabelRef}
          label="OPEN FILE"
        />
      </div>
      <main className="archivePage">
      <header className="archiveTopbar">
        <Link className="archiveBack" to="/#work" onClick={(event) => { event.preventDefault(); returnToWork(); }}>← BACK TO WORK</Link>
        <span>ARCHIVE // SELECT YOUR PATH</span>
      </header>

      <section className="archiveIntro" aria-labelledby="archive-title">
        <div className="archiveIntroLabels">
          <span>PERSONA / FILE SYSTEM</span>
          <span>/// OPEN ACCESS</span>
        </div>
        <h1 id="archive-title">
          <span>THE</span>
          <span>ARCHIVE<span className="archiveTitleDot">.</span></span>
        </h1>
        <p>CHOOSE A DISCIPLINE. EXPLORE THE FULL VISUAL RECORD.</p>
        <div className="archiveDivider" aria-hidden="true" />
        <div className="archiveChooseLabel">CHOOSE YOUR PATH <span>↓</span></div>
      </section>

      <section className="archiveChoices" aria-label="Archive categories">
        {collections.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`archiveChoice${selected?.id === category.id ? " archiveChoiceActive" : ""}`}
            onClick={() => changeCategory(category.id)}
            aria-pressed={selected?.id === category.id}
          >
            <span className="archiveChoiceTop">
              <span>FILE / {category.number}</span>
              <span>{String(category.images.length).padStart(2, "0")} IMAGES</span>
            </span>
            <span className="archiveChoiceTitle">{category.label}</span>
            <span className="archiveChoiceBottom">
              <span>{category.description}</span>
              <span className="archiveChoiceArrow" aria-hidden="true">↗</span>
            </span>
          </button>
        ))}
      </section>

      {selected && (
        <section
          ref={resultsRef}
          className="archiveResults"
          aria-labelledby="archive-results-title"
          key={selected.id}
        >
          <div className="archiveResultsHeading">
            <div>
              <span className="archiveResultsKicker">OPEN FILE /// {selected.number}</span>
              <h2 id="archive-results-title">{selected.label}</h2>
            </div>
            <div className="archiveResultsMeta">
              <span>{galleryCaption}</span>
              <button type="button" onClick={() => changeCategory(null)}>× CLOSE FILE</button>
            </div>
          </div>

          {selected.images.length > 0 ? (
            <div className="archiveMasonry">
              {selected.images.map((image, index) => (
                <button
                  key={`${image.projectSlug}-${image.src}-${index}`}
                  className="archiveTile"
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  aria-label={`View ${image.projectTitle} image ${image.imageNumber}`}
                >
                  <img
                    src={image.src}
                    alt={`${image.projectTitle} — image ${image.imageNumber}`}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="archiveTileInfo">
                    <span>{image.projectNumber} / {image.projectTitle}</span>
                    <span aria-hidden="true">↗</span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="archiveEmpty">
              <span>NO FILES FOUND ///</span>
              <h3>COMING SOON.</h3>
              <p>
                {selected.projectCount === 0
                  ? `Tag a project ${selected.label} in src/data/projects.ts to show it here.`
                  : `Add images to the tagged project folders under src/media/projects/ to show them here.`}
              </p>
            </div>
          )}
        </section>
      )}

      <footer className="archiveFooter">
        <Link to="/#work" onClick={(event) => { event.preventDefault(); returnToWork(); }}>← RETURN TO WORK</Link>
        <span>END OF ARCHIVE ///</span>
      </footer>

      {activeImage && selected && lightboxIndex !== null && (
        <div className="archiveLightbox" role="dialog" aria-modal="true" aria-label="Archive image viewer">
          <button
            type="button"
            className="archiveLightboxBackdrop"
            aria-label="Close image viewer"
            onClick={() => setLightboxIndex(null)}
          />
          <div className="archiveLightboxPanel">
            <div className="archiveLightboxBar">
              <span>{selected.label} / {activeImage.projectTitle}</span>
              <span>{String(lightboxIndex + 1).padStart(2, "0")} / {String(imageCount).padStart(2, "0")}</span>
              <button ref={closeRef} type="button" onClick={() => setLightboxIndex(null)} aria-label="Close image viewer">×</button>
            </div>
            <div className="archiveLightboxBody">
              <button
                type="button"
                className="archiveLightboxArrow archiveLightboxPrev"
                onClick={() => setLightboxIndex((lightboxIndex - 1 + imageCount) % imageCount)}
                aria-label="Previous image"
              >←</button>
              <img src={activeImage.src} alt={`${activeImage.projectTitle} — image ${activeImage.imageNumber}`} />
              <button
                type="button"
                className="archiveLightboxArrow archiveLightboxNext"
                onClick={() => setLightboxIndex((lightboxIndex + 1) % imageCount)}
                aria-label="Next image"
              >→</button>
            </div>
            <div className="archiveLightboxBottom">
              <span>CASE {activeImage.projectNumber} / {activeImage.projectTitle}</span>
              <small>← → TO BROWSE · ESC TO CLOSE</small>
            </div>
          </div>
        </div>
      )}
    </main>
    </>
  );
}
