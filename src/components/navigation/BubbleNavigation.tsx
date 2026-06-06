import { profile } from "../../data/profile";
import { handleInternalLink } from "../../router";
import { LanyardContact } from "../reactbits/LanyardContact";

type BubbleNavigationProps = {
  currentPath: string;
};

const navItems = [
  { label: "Gallery", href: "/gallery" },
  { label: "Notes", href: "/notes" },
];

export function BubbleNavigation({ currentPath }: BubbleNavigationProps) {
  return (
    <header className="site-nav" aria-label="Primary navigation">
      <nav className="bubble-menu">
        <a
          className="bubble-logo"
          href="/"
          aria-label="Go to home"
          onClick={(event) => handleInternalLink(event, "/")}
        >
          {profile.logo}
        </a>
        <div className="bubble-menu__items">
          {navItems.map((item) => {
            const isActive = currentPath === item.href || currentPath.startsWith(`${item.href}/`);

            return (
              <a
                key={item.href}
                className={isActive ? "bubble-link is-active" : "bubble-link"}
                href={item.href}
                onClick={(event) => handleInternalLink(event, item.href)}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </nav>
      <LanyardContact />
    </header>
  );
}
