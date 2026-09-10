import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getProjectBySlug } from "./data/projects";
import { getProjectImages } from "./data/media";
import "./projectDetail.css";

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  if (!project) {
    return (
      <main className="detailMissing">
        <span>404 /// CASE FILE NOT FOUND</span>
        <h1>PROJECT MISSING.</h1>
        <Link to="/">RETURN TO ARCHIVE →</Link>
      </main>
    );
  }

  const discoveredImages = getProjectImages(project.slug);
  const heroImage = project.coverImage ?? discoveredImages[0];
  const remainingImages = project.coverImage
    ? discoveredImages
    : discoveredImages.slice(1);

  return (
    <main className="projectDetailPage">
      <header className="detailTopbar">
        <Link to="/#work">← BACK TO ARCHIVE</Link>
        <span>CASE FILE // {project.number}</span>
      </header>

      <section className="detailHero">
        <div className="detailHeroCopy">
          <span className="detailCategory">{project.category}</span>
          <h1>
            {project.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p>{project.description}</p>
        </div>

        <div className="detailHeroImage">
          {heroImage ? (
            <img src={heroImage} alt={`${project.title.join(" ")} feature`} />
          ) : (
            <div className="detailImagePlaceholder">
              <span>PROJECT IMAGE</span>
              <small>/ ADD IMAGES TO THE PROJECT MEDIA FOLDER /</small>
            </div>
          )}
        </div>
      </section>

      <section className="detailMeta">
        <div>
          <span>ROLE ///</span>
          <strong>{project.role}</strong>
        </div>
        <div>
          <span>TOOLS ///</span>
          <strong>{project.tools.join(" / ")}</strong>
        </div>
        <div>
          <span>TAGS ///</span>
          <strong>{project.tags.join(" / ")}</strong>
        </div>
      </section>

      <section className="detailStory">
        <article>
          <span>01 / PROBLEM</span>
          <h2>THE SETUP.</h2>
          <p>{project.problem ?? "Add the project context and creative challenge here."}</p>
        </article>
        <article>
          <span>02 / APPROACH</span>
          <h2>THE MOVE.</h2>
          <p>{project.approach ?? "Explain the process, experiments, and decisions here."}</p>
        </article>
        <article>
          <span>03 / RESULT</span>
          <h2>THE PAYOFF.</h2>
          <p>{project.result ?? "Describe the outcome and what you learned here."}</p>
        </article>
      </section>

      {remainingImages.length > 0 && (
        <section className="detailGallery">
          <div className="detailGalleryHeader">
            <span>VISUAL RECORD ///</span>
            <h2>MORE FROM THE FILE.</h2>
          </div>
          <div className="detailGalleryGrid">
            {remainingImages.map((image, index) => (
              <img
                src={image}
                alt={`${project.title.join(" ")} detail ${index + 1}`}
                loading="lazy"
                decoding="async"
                key={image}
              />
            ))}
          </div>
        </section>
      )}

      {project.links && project.links.length > 0 && (
        <section className="detailLinks">
          <span>EXTERNAL FILES ///</span>
          <div>
            {project.links.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                {link.label} ↗
              </a>
            ))}
          </div>
        </section>
      )}

      <footer className="detailFooter">
        <Link to="/#work">← RETURN TO WORK</Link>
        <span>END OF CASE FILE // {project.number}</span>
      </footer>
    </main>
  );
}
