import Dither from "./Dither";

export function DitherBackground() {
  const isTest = import.meta.env.MODE === "test";

  return (
    <div className="dither-background" aria-hidden="true">
      <div className="reactbits-dither-stage">
        {!isTest && <Dither mouseRadius={0.34} />}
      </div>
    </div>
  );
}
