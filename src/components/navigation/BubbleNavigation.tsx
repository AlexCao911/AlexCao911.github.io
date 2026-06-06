import { profile } from "../../data/profile";
import { handleInternalLink } from "../../router";
import BubbleMenu from "../reactbits/BubbleMenu/BubbleMenu";
import { LanyardContact } from "../reactbits/LanyardContact";

type BubbleNavigationProps = {
  currentPath: string;
};

const bubbleItems = [
  {
    label: "gallery",
    href: "/gallery",
    ariaLabel: "Gallery",
    rotation: -8,
    hoverStyles: { bgColor: "#111111", textColor: "#ffffff" },
  },
  {
    label: "notes",
    href: "/notes",
    ariaLabel: "Notes",
    rotation: 8,
    hoverStyles: { bgColor: "#111111", textColor: "#ffffff" },
  },
];

export function BubbleNavigation({ currentPath: _currentPath }: BubbleNavigationProps) {
  return (
    <>
      <BubbleMenu
        logo={
          <a
            className="bubble-home-link"
            href="/"
            aria-label="Go to home"
            onClick={(event) => handleInternalLink(event, "/")}
          >
            {profile.logo}
          </a>
        }
        items={bubbleItems}
        menuBg="#ffffff"
        menuContentColor="#111111"
        menuAriaLabel="Toggle site menu"
        useFixedPosition
      />
      <div className="nav-lanyard-slot">
        <LanyardContact />
      </div>
    </>
  );
}
