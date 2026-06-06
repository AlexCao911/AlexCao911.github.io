import Dither from "./Dither";

export function DitherBackground() {
  const isTest = import.meta.env.MODE === "test";

  return (
    <div className="dither-background" aria-hidden="true">
      <div className="reactbits-dither-stage">
        {!isTest && (
          <Dither
            waveColor={[0.82, 0.82, 0.82]}
            waveSpeed={0.035}
            waveFrequency={3.5}
            waveAmplitude={0.32}
            colorNum={5}
            pixelSize={4}
            mouseRadius={0.9}
          />
        )}
      </div>
    </div>
  );
}
