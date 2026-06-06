import { PointerEvent, useMemo, useState } from "react";

type CubesProps = {
  gridSize?: number;
};

export function Cubes({ gridSize = 8 }: CubesProps) {
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });
  const cells = useMemo(() => Array.from({ length: gridSize * gridSize }, (_, index) => index), [gridSize]);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    });
  };

  return (
    <div
      className="cube-field"
      onPointerMove={handlePointerMove}
      style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      aria-hidden="true"
    >
      {cells.map((cell) => {
        const row = Math.floor(cell / gridSize);
        const column = cell % gridSize;
        const dx = pointer.x - (column + 0.5) / gridSize;
        const dy = pointer.y - (row + 0.5) / gridSize;
        const lift = Math.max(0, 1 - Math.hypot(dx, dy) * 3.2);

        return (
          <span
            key={cell}
            className="cube"
            style={{
              transform: `translateY(${-lift * 18}px) rotateX(${52 + lift * 12}deg) rotateZ(45deg)`,
              opacity: 0.45 + lift * 0.55,
            }}
          />
        );
      })}
    </div>
  );
}
