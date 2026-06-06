import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import App from "../App";

afterEach(() => {
  cleanup();
});

describe("personal website routing", () => {
  test("renders the home introduction and contact email", () => {
    window.history.pushState({}, "", "/");

    render(<App />);

    expect(screen.getByRole("heading", { name: /alexander cou/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/contact information/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /hello@alexandercou\.com/i })).toBeInTheDocument();
  });

  test("uses the official ReactBits BubbleMenu navigation shell", () => {
    window.history.pushState({}, "", "/gallery");

    render(<App />);

    expect(screen.getByRole("navigation", { name: /main navigation/i })).toHaveClass("bubble-menu");
    expect(screen.getByRole("button", { name: /toggle site menu/i })).toHaveClass("toggle-bubble");
    expect(document.querySelector(".bubble-menu .logo-bubble")).toBeInTheDocument();
    expect(document.querySelectorAll(".bubble-link")).toHaveLength(0);
  });

  test("keeps one lanyard contact panel without a visible contact chip", () => {
    window.history.pushState({}, "", "/");

    render(<App />);

    expect(document.querySelectorAll(".lanyard")).toHaveLength(1);
    expect(document.querySelectorAll(".lanyard__label")).toHaveLength(0);
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
    expect(scrambledParagraph).toHaveTextContent("Gallery index / experiments / prototypes");
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
