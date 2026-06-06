import { ScrambledText } from "./reactbits/ScrambledText";

export const FOOTER_QUOTE =
  "the people who are crazy enough to think they can change the world, are the ones who do";

export function SiteFooter() {
  return (
    <footer className="page-footer">
      <ScrambledText className="scrambled-text">{FOOTER_QUOTE}</ScrambledText>
    </footer>
  );
}
