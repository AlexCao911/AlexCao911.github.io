import Lanyard from "./Lanyard";

export function LanyardContact() {
  const isTest = import.meta.env.MODE === "test";

  return (
    <div className="lanyard" aria-hidden="true">
      {!isTest && (
        <div className="official-lanyard-viewport" aria-hidden="true">
          <Lanyard position={[0, 0, 22]} fov={22} gravity={[0, -36, 0]} bandPosition={[5.2, 4.85, 0]} />
        </div>
      )}
    </div>
  );
}
