import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import App from "../App";

describe("personal website routing", () => {
  test("renders the home introduction and contact email", () => {
    window.history.pushState({}, "", "/");

    render(<App />);

    expect(screen.getByRole("heading", { name: /alexander cou/i })).toBeInTheDocument();
    expect(screen.getByText(/contact/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /alexander\.cou@example\.com/i })).toBeInTheDocument();
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

  test("renders notes and a note detail page", () => {
    window.history.pushState({}, "", "/notes");

    const { rerender } = render(<App />);

    expect(screen.getByRole("heading", { level: 1, name: /notes/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /read note/i })).toHaveLength(3);

    window.history.pushState({}, "", "/notes/designing-with-motion");
    rerender(<App />);

    expect(screen.getByRole("heading", { name: /designing with motion/i })).toBeInTheDocument();
  });
});
