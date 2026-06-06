export type Work = {
  slug: string;
  title: string;
  year: string;
  type: string;
  summary: string;
  detail: string;
  accent: string;
};

export const works: Work[] = [
  {
    slug: "interface-atlas",
    title: "Interface Atlas",
    year: "2026",
    type: "Product System",
    summary: "A compact visual system for collecting reusable interaction patterns.",
    detail:
      "Interface Atlas organizes product flows into reusable interaction maps, with emphasis on scanning, comparison, and fast prototyping.",
    accent: "#00bcd4",
  },
  {
    slug: "motion-notes",
    title: "Motion Notes",
    year: "2025",
    type: "Prototype",
    summary: "A note-taking surface where motion carries hierarchy instead of decoration.",
    detail:
      "Motion Notes explores subtle animated affordances for writing, clustering, and revisiting personal knowledge.",
    accent: "#ff5c35",
  },
  {
    slug: "local-ai-watch",
    title: "Local AI Watch",
    year: "2025",
    type: "Research Tool",
    summary: "A local-first dashboard for model experiments and evaluation traces.",
    detail:
      "Local AI Watch brings benchmark runs, prompt history, and small-device constraints into a single readable workspace.",
    accent: "#b7ff5d",
  },
];
