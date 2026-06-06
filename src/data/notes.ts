export type Note = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  body: string[];
};

export const notes: Note[] = [
  {
    slug: "designing-with-motion",
    title: "Designing With Motion",
    date: "2026-06-06",
    excerpt: "Motion is most useful when it explains what just changed.",
    body: [
      "Good interface motion is closer to punctuation than spectacle. It tells the reader where to look, what changed, and whether the system understood the action.",
      "The best effects have an exit strategy. They appear, clarify the moment, and get out of the way before they become noise.",
    ],
  },
  {
    slug: "personal-systems",
    title: "Personal Systems Need Edges",
    date: "2026-05-18",
    excerpt: "A tool becomes calming when it has clear limits.",
    body: [
      "Personal software often fails by becoming too shapeless. Boundaries are not a lack of ambition; they are how a system earns trust.",
      "A small set of repeatable gestures can do more for daily use than another large feature surface.",
    ],
  },
  {
    slug: "small-interfaces",
    title: "Small Interfaces, Long Memory",
    date: "2026-04-29",
    excerpt: "Tiny controls can carry a surprising amount of identity.",
    body: [
      "A compact interface rewards care. The spacing, labels, hover states, and empty states all become more visible.",
      "When the surface is small, every decision has to pull its weight.",
    ],
  },
];
