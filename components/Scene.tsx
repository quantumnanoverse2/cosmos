"use client";

import { Canvas } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import Galaxy from "./Galaxy";

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 3, 10] }}>
      <ambientLight intensity={1} />

      <Galaxy />

      <Stars
        radius={100}
        depth={50}
        count={7000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
      />
    </Canvas>
  );
}