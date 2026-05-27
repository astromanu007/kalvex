"use client";

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";

function TechnicalSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useFrame((state) => {
    if (meshRef.current) {
      // Smoothly follow cursor
      const targetX = state.mouse.x * 2;
      const targetY = state.mouse.y * 2;
      
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
      
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2 + state.mouse.y * 0.5;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3 + state.mouse.x * 0.5;
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere ref={meshRef} args={[1, 64, 64]}>
          <MeshDistortMaterial
            color="#2563eb"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0}
            metalness={1}
          />
        </Sphere>
      </Float>
      
      {/* Outer Wireframe */}
      <Sphere args={[1.2, 32, 32]}>
        <meshStandardMaterial
          color="#2563eb"
          wireframe
          transparent
          opacity={0.1}
        />
      </Sphere>
    </group>
  );
}

function Grid() {
  useFrame((state) => {
    // Subtle grid tilt based on mouse
  });

  return (
    <group rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -2, -5]}>
      <gridHelper args={[20, 20, "#2563eb", "#e2e8f0"]} opacity={0.2} transparent />
    </group>
  );
}

export function ThreeScene() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} color="#2563eb" />
        
        <TechnicalSphere />
        <Grid />
        
        <fog attach="fog" args={["#f8fafc", 5, 15]} />
      </Canvas>
    </div>
  );
}
