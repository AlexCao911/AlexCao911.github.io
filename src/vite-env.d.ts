/// <reference types="vite/client" />

import "@react-three/fiber";

declare module "*.glb" {
  const src: string;
  export default src;
}

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: any;
    meshLineMaterial: any;
  }
}
