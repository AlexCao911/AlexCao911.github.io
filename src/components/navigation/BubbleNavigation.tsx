import { handleInternalLink } from "../../router";
import BubbleMenu from "../reactbits/BubbleMenu/BubbleMenu";

type BubbleNavigationProps = {
  currentPath: string;
};

const bubbleItems = [
  {
    label: "Gallery",
    href: "/gallery",
    ariaLabel: "Gallery",
    rotation: -8,
    hoverStyles: { bgColor: "rgba(255, 255, 255, 0.7)", textColor: "#111111" },
  },
  {
    label: "Notes",
    href: "/notes",
    ariaLabel: "Notes",
    rotation: 8,
    hoverStyles: { bgColor: "rgba(255, 255, 255, 0.7)", textColor: "#111111" },
  },
];

export function BubbleNavigation({ currentPath: _currentPath }: BubbleNavigationProps) {
  return (
    <BubbleMenu
      logo={
        <a
          className="bubble-home-link"
          href="/"
          aria-label="Go to home"
          onClick={(event) => handleInternalLink(event, "/")}
        >
          <img className="bubble-home-logo bubble-logo" src="/assets/brand/logo.png" alt="" aria-hidden="true" />
        </a>
      }
      items={bubbleItems}
      menuBg="#ffffff"
      menuContentColor="#111111"
      menuAriaLabel="Toggle site menu"
      useFixedPosition
    />
  );
}
