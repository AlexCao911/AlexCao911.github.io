import { MouseEvent, useEffect, useState } from "react";

export function usePathname() {
  const [pathname, setPathname] = useState(() => window.location.pathname || "/");

  useEffect(() => {
    const handleLocationChange = () => setPathname(window.location.pathname || "/");

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("pushstate", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("pushstate", handleLocationChange);
    };
  }, []);

  return pathname;
}

export function navigateTo(href: string) {
  window.history.pushState({}, "", href);
  window.dispatchEvent(new Event("pushstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function handleInternalLink(event: MouseEvent<HTMLAnchorElement>, href: string) {
  if (
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.currentTarget.target
  ) {
    return;
  }

  event.preventDefault();
  navigateTo(href);
}
