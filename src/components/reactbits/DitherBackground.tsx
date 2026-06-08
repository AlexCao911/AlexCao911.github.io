import { lazy, Suspense } from "react";

const Dither = lazy(() => import("./Dither"));

export function DitherBackground() {
  const isTest = import.meta.env.MODE === "test";

  return (
    <div className="dither-background" aria-hidden="true">
      <div className="reactbits-dither-stage">
        {!isTest ? (
          <Suspense fallback={null}>
            <Dither mouseRadius={0.34} />
          </Suspense>
        ) : null}
      </div>
    </div>
  );
}
