import { PointerEvent, useState } from "react";
import { profile } from "../../data/profile";
import Lanyard from "./Lanyard";

export function LanyardContact() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const isTest = import.meta.env.MODE === "test";

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -10;
    setTilt({ x, y });
  };

  return (
    <div className="lanyard" aria-label="Contact information">
      {!isTest && (
        <div className="official-lanyard-viewport" aria-hidden="true">
          <Lanyard position={[0, 0, 20]} fov={24} gravity={[0, -36, 0]} />
        </div>
      )}
      <div
        className="lanyard__card"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        style={{ transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)` }}
      >
        <a className="lanyard__email" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <span>{profile.location}</span>
        <span>{profile.availability}</span>
      </div>
    </div>
  );
}
