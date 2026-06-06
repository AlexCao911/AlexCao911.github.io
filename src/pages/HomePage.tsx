import { DitherBackground } from "../components/reactbits/DitherBackground";
import { SiteFooter } from "../components/SiteFooter";
import { profile } from "../data/profile";

export function HomePage() {
  return (
    <main className="page home-page">
      <DitherBackground />
      <section className="home-hero">
        <h1>{profile.name}</h1>
      </section>
      <SiteFooter />
    </main>
  );
}
