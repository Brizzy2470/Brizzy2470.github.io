export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  number: string;
  title: string[];
  slug: string;
  category: string;
  description: string;
  tags: string[];
  role: string;
  tools: string[];

  // Optional. If omitted, the first image inside
  // src/media/projects/<slug>/ becomes the cover automatically.
  coverImage?: string;

  problem?: string;
  approach?: string;
  result?: string;
  links?: ProjectLink[];
};

// ============================================================
// PROJECTS
// To add a project, copy one block below and change the text.
// Then put project images in:
// src/media/projects/YOUR-PROJECT-SLUG/
// ============================================================

export const projects: Project[] = [
  {
    number: "001",
    title: ["PROJECT", "ALPHA"],
    slug: "project-alpha",
    category: "CREATIVE DEVELOPMENT",
    description:
      "A generic case study placeholder for a creative project. Replace this with the real project story later.",
    tags: ["DESIGN", "CODE", "EXPERIMENT"],
    role: "DESIGN / DEVELOPMENT",
    tools: ["REACT", "TYPESCRIPT", "GSAP"],
    problem: "Explain the context, constraint, or creative challenge here.",
    approach: "Describe the design process, technical approach, or experiments.",
    result: "Add outcomes, lessons learned, and what changed because of the work.",
  },
  {
    number: "002",
    title: ["PROJECT", "BETA"],
    slug: "project-beta",
    category: "INTERACTIVE EXPERIENCE",
    description:
      "A second placeholder case study for an interactive project or experiment.",
    tags: ["WEB", "MOTION", "UI"],
    role: "INTERACTION / UI",
    tools: ["WEB", "MOTION", "SYSTEM"],
    problem: "Explain the context, constraint, or creative challenge here.",
    approach: "Describe the design process, technical approach, or experiments.",
    result: "Add outcomes, lessons learned, and what changed because of the work.",
  },
  {
    number: "003",
    title: ["PROJECT", "GAMMA"],
    slug: "project-gamma",
    category: "VISUAL EXPERIMENT",
    description:
      "A third placeholder case study that can later hold process notes, screenshots, and results.",
    tags: ["ART", "SYSTEM", "IDEA"],
    role: "ART / DEVELOPMENT",
    tools: ["DESIGN", "CODE", "EXPERIMENT"],
    problem: "Explain the context, constraint, or creative challenge here.",
    approach: "Describe the design process, technical approach, or experiments.",
    result: "Add outcomes, lessons learned, and what changed because of the work.",
  },
];

export const getProjectBySlug = (slug?: string) =>
  projects.find((project) => project.slug === slug);
