import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import App from "../App";
import { ContentBlocks } from "../components/ContentBlocks";
import { FOOTER_QUOTE } from "../components/SiteFooter";
import { works } from "../data/gallery";
import { parseMarkdownDocument } from "../data/markdown";
import { notes } from "../data/notes";

afterEach(() => {
  cleanup();
});

describe("personal website routing", () => {
  test("renders the home name without extra introduction text", () => {
    window.history.pushState({}, "", "/");

    render(<App />);

    expect(screen.getByRole("heading", { name: /alexander cou/i })).toBeInTheDocument();
    expect(screen.queryByText(/personal site/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/designer-developer/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /hello@alexandercou\.com/i })).not.toBeInTheDocument();
  });

  test("loads gallery and notes content from markdown collections", () => {
    expect(works.map((work) => work.slug)).toEqual(["interface-atlas", "motion-notes", "local-ai-watch"]);
    expect(notes.map((note) => note.slug)).toEqual(["designing-with-motion", "personal-systems", "small-interfaces"]);
  });

  test("parses and renders multimedia markdown blocks", () => {
    const markdownDocument = parseMarkdownDocument(`
---
title: Media Note
---

Intro paragraph.

::image
src: /assets/content/demo/screen.png
alt: Demo screen
caption: Interface still
::

::video
src: /assets/content/demo/demo.mp4
poster: /assets/content/demo/poster.png
caption: Motion demo
::

::embed
src: https://www.youtube.com/embed/demo
title: Demo embed
::
`);

    expect(markdownDocument.body).toEqual(["Intro paragraph."]);
    expect(markdownDocument.blocks.map((block) => block.type)).toEqual(["paragraph", "image", "video", "embed"]);

    render(<ContentBlocks blocks={markdownDocument.blocks} />);

    expect(screen.getByText("Intro paragraph.")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /demo screen/i })).toHaveAttribute("src", "/assets/content/demo/screen.png");
    expect(document.querySelector("video")).toHaveAttribute("src", "/assets/content/demo/demo.mp4");
    expect(screen.getByTitle("Demo embed")).toHaveAttribute("src", "https://www.youtube.com/embed/demo");
  });

  test("uses the official ReactBits BubbleMenu navigation shell", () => {
    window.history.pushState({}, "", "/gallery");

    render(<App />);

    expect(screen.getByRole("navigation", { name: /main navigation/i })).toHaveClass("bubble-menu");
    expect(screen.getByRole("button", { name: /toggle site menu/i })).toHaveClass("toggle-bubble");
    expect(document.querySelector(".bubble-menu .logo-bubble")).toBeInTheDocument();
    expect(document.querySelectorAll(".bubble-link")).toHaveLength(0);
  });

  test("uses the footer monospace weight for bubble menu links", () => {
    window.history.pushState({}, "", "/gallery");

    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /toggle site menu/i }));

    const galleryLink = screen.getByRole("menuitem", { name: /gallery/i });
    const notesLink = screen.getByRole("menuitem", { name: /notes/i });

    expect(getComputedStyle(galleryLink).fontFamily).toContain("ui-monospace");
    expect(getComputedStyle(notesLink).fontFamily).toContain("ui-monospace");
    expect(getComputedStyle(galleryLink).fontWeight).toBe("700");
    expect(getComputedStyle(notesLink).fontWeight).toBe("700");
  });

  test("keeps the decorative lanyard card hidden for now", () => {
    window.history.pushState({}, "", "/");

    render(<App />);

    expect(document.querySelectorAll(".nav-lanyard-slot")).toHaveLength(0);
    expect(document.querySelectorAll(".lanyard")).toHaveLength(0);
    expect(document.querySelectorAll(".lanyard__info")).toHaveLength(0);
    expect(document.querySelectorAll(".lanyard__card")).toHaveLength(0);
    expect(document.querySelectorAll(".lanyard__label")).toHaveLength(0);
    expect(screen.queryByText(/shanghai \/ remote/i)).not.toBeInTheDocument();
  });

  test("renders gallery cards and a work detail page", () => {
    window.history.pushState({}, "", "/gallery");

    const { rerender } = render(<App />);

    expect(screen.getByRole("heading", { name: /gallery/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /open work/i })).toHaveLength(3);

    window.history.pushState({}, "", "/gallery/interface-atlas");
    rerender(<App />);

    expect(screen.getByRole("heading", { name: /interface atlas/i })).toBeInTheDocument();
  });

  test("renders gallery and notes as title-first showcase pages", () => {
    window.history.pushState({}, "", "/gallery");

    const { unmount } = render(<App />);

    expect(document.querySelector(".gallery-hero .showcase-copy + .reactbits-showcase")).toBeInTheDocument();

    unmount();
    window.history.pushState({}, "", "/notes");
    render(<App />);

    expect(document.querySelector(".notes-hero .showcase-copy + .reactbits-showcase")).toBeInTheDocument();
  });

  test("uses a touch-ready regular dodecahedron grid on the gallery hero", () => {
    window.history.pushState({}, "", "/gallery");

    render(<App />);

    expect(document.querySelector(".gallery-hero .dodecahedron-grid")).toHaveAttribute(
      "data-gallery-geometry",
      "regular-dodecahedron"
    );
    expect(document.querySelector(".gallery-hero .dodecahedron-grid")).toHaveAttribute(
      "data-mobile-touch-interaction",
      "true"
    );
    expect(document.querySelectorAll(".gallery-hero .dodecahedron")).toHaveLength(64);
    expect(document.querySelectorAll(".gallery-hero .dodecahedron-face")).toHaveLength(64 * 12);
    expect(document.querySelector(".gallery-hero .gallery-rive-showcase")).not.toBeInTheDocument();
    expect(document.querySelector(".gallery-hero .cube--tetrahedron")).not.toBeInTheDocument();
    expect(document.querySelector(".gallery-hero .meta-balls")).not.toBeInTheDocument();
  });

  test("renders notes and a note detail page", () => {
    window.history.pushState({}, "", "/notes");

    const { rerender } = render(<App />);

    expect(screen.getByRole("heading", { level: 1, name: /notes/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /read note/i })).toHaveLength(3);

    window.history.pushState({}, "", "/notes/designing-with-motion");
    rerender(<App />);

    expect(screen.getByRole("heading", { name: /designing with motion/i })).toBeInTheDocument();
  });

  test("uses the ReactBits ScrambledText paragraph structure in footers", () => {
    window.history.pushState({}, "", "/gallery");

    render(<App />);

    const scrambledParagraph = document.querySelector(".page-footer .scrambled-text p");
    expect(scrambledParagraph).toHaveTextContent(FOOTER_QUOTE.trim());
  });

  test("renders footers as full-bleed sections", () => {
    window.history.pushState({}, "", "/notes");

    render(<App />);

    expect(document.querySelector(".page-footer")).toBeInTheDocument();
    expect(document.querySelector(".page-footer .scrambled-text")).toBeInTheDocument();
  });

  test("uses the ReactBits Cubes face structure on the notes hero", () => {
    window.history.pushState({}, "", "/notes");

    render(<App />);

    expect(document.querySelector(".notes-hero .cube .cube-face")).toBeInTheDocument();
  });

  test("uses the official ReactBits Cubes default grid on the notes hero", () => {
    window.history.pushState({}, "", "/notes");

    render(<App />);

    expect(document.querySelectorAll(".notes-hero .cube")).toHaveLength(100);
  });

  test("mounts the ReactBits Dither stage on the home page", () => {
    window.history.pushState({}, "", "/");

    render(<App />);

    expect(document.querySelector(".dither-background .reactbits-dither-stage")).toBeInTheDocument();
  });

  test("mounts the ReactBits FluidGlass cursor shell", () => {
    window.history.pushState({}, "", "/notes");

    render(<App />);

    expect(document.querySelector(".fluid-glass-cursor")).toBeInTheDocument();
  });

  test("keeps the top robot hidden for now", () => {
    window.history.pushState({}, "", "/gallery");

    render(<App />);

    expect(document.querySelectorAll(".robot-animation")).toHaveLength(0);
    expect(document.querySelector(".nav-robot-slot")).not.toBeInTheDocument();
  });

  test("uses a monochrome gallery accent palette", () => {
    window.history.pushState({}, "", "/gallery");

    render(<App />);

    const workCards = Array.from(document.querySelectorAll<HTMLElement>(".work-card"));
    expect(workCards.map((card) => card.style.getPropertyValue("--accent"))).toEqual([
      "#111111",
      "#111111",
      "#111111",
    ]);
  });
});
