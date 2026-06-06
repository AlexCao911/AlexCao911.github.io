import { handleInternalLink } from "../router";

export function NotFoundPage() {
  return (
    <main className="page detail-page">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <a className="back-link" href="/" onClick={(event) => handleInternalLink(event, "/")}>
        Back home
      </a>
    </main>
  );
}
