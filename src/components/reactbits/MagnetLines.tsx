import { PointerEvent, useMemo, useState } from "react";

type MagnetLinesProps = {
  rows?: number;
  columns?: number;
  baseAngle?: number;
};

export function MagnetLines({ rows = 9, columns = 12, baseAngle = -10 }: MagnetLinesProps) {
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });
  const cells = useMemo(() => Array.from({ length: rows * columns }, (_, index) => index), [rows, columns]);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    });
  };

  return (
    <div
      className="magnet-lines"
      onPointerMove={handlePointerMove}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      aria-hidden="true"
    >
      {cells.map((cell) => {
        const row = Math.floor(cell / columns);
        const column = cell % columns;
        const dx = pointer.x - (column + 0.5) / columns;
        const dy = pointer.y - (row + 0.5) / rows;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90 + baseAngle;

        return <span key={cell} style={{ transform: `rotate(${angle}deg)` }} />;
      })}
    </div>
  );
}
