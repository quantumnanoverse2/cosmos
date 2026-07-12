"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, useTexture } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

interface PlanetProps {
  textureUrl: string;
}

function Planet({ textureUrl }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Load texture
  const texture = useTexture(textureUrl);
  texture.colorSpace = THREE.SRGBColorSpace;

  // Rotate planet slowly
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial 
        map={texture}
        roughness={0.6}
        metalness={0.1}
      />
    </mesh>
  );
}

export default function PlanetViewer({ textureUrl }: { textureUrl: string }) {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 3, 5]} intensity={2.5} castShadow />
        <directionalLight position={[-5, -3, -5]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <Planet textureUrl={textureUrl} />
        </Suspense>

        <OrbitControls 
          enableZoom={true} 
          enablePan={false} 
          minDistance={3} 
          maxDistance={10} 
          autoRotate={false}
        />
      </Canvas>
      
      {/* Overlay to hint at interactivity */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white/50 text-xs tracking-widest uppercase flex items-center gap-2">
        <span>Drag to rotate</span>
        <span className="w-1 h-1 bg-white/30 rounded-full"></span>
        <span>Scroll to zoom</span>
      </div>
    </div>
  );
}
