import { DitherBackground } from "../components/reactbits/DitherBackground";
import { ScrambledText } from "../components/reactbits/ScrambledText";
import { profile } from "../data/profile";

export function HomePage() {
  return (
    <main className="page home-page">
      <DitherBackground />
      <section className="home-hero">
        <p className="eyebrow">Personal site / visual systems / notes</p>
        <h1>{profile.name}</h1>
        <p className="home-role">{profile.role}</p>
        <p className="home-intro">{profile.intro}</p>
      </section>
      <footer className="page-footer">
        <ScrambledText>Home Gallery Notes Contact</ScrambledText>
      </footer>
    </main>
  );
}
