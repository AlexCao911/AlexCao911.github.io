import { ReactNode, useMemo, useState } from "react";

type ScrambledTextProps = {
  children: ReactNode;
  scrambleChars?: string;
  className?: string;
};

export function ScrambledText({ children, scrambleChars = ".:01", className = "" }: ScrambledTextProps) {
  const text = useMemo(() => String(children), [children]);
  const [active, setActive] = useState(false);

  return (
    <span
      className={`scrambled-text ${className}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      {text.split("").map((char, index) => {
        const replacement = scrambleChars[index % scrambleChars.length] ?? char;

        return (
          <span key={`${char}-${index}`} style={{ transitionDelay: `${index * 12}ms` }}>
            {active && char !== " " ? replacement : char}
          </span>
        );
      })}
    </span>
  );
}
