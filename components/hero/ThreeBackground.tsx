"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!mountRef.current) return;

    // SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    
    // Set background color based on theme (dark navy vs light mode bg)
    const isDark = theme === "dark" || !theme || theme === "system";
    scene.background = new THREE.Color(isDark ? "#07071A" : "#F5F5FA");

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // RESPONSIVE COMPLEXITY
    const isMobile = window.innerWidth < 768;
    const detailLevel = isMobile ? 1 : 2;

    // GEOMETRIES & MATERIALS
    const geometry1 = new THREE.IcosahedronGeometry(1.5, detailLevel);
    const geometry2 = new THREE.IcosahedronGeometry(1.2, detailLevel);
    const geometry3 = new THREE.IcosahedronGeometry(0.8, detailLevel);

    const materialCoral = new THREE.MeshBasicMaterial({
      color: "#FF6584", // Coral Pink
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });

    const materialViolet = new THREE.MeshBasicMaterial({
      color: "#6C63FF", // Electric Violet
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });

    const mesh1 = new THREE.Mesh(geometry1, materialCoral);
    const mesh2 = new THREE.Mesh(geometry2, materialViolet);
    const mesh3 = new THREE.Mesh(geometry3, materialCoral);

    mesh1.position.set(-2, 0, 0);
    mesh2.position.set(2, 1, -1);
    mesh3.position.set(0, -1.5, 1);

    scene.add(mesh1, mesh2, mesh3);

    // MOUSE PARALLAX
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - windowHalfX) * 0.02;
      mouseY = (event.clientY - windowHalfY) * 0.02;
    };

    document.addEventListener("mousemove", onDocumentMouseMove);

    // ANIMATION LOOP
    let animationFrameId: number;
    let time = 0;
    let isTabVisible = true;

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isTabVisible) return; // Pause when tab hidden

      time += 0.01;

      // Slow rotation
      mesh1.rotation.x += 0.001;
      mesh1.rotation.y += 0.002;
      mesh2.rotation.x -= 0.002;
      mesh2.rotation.y += 0.001;
      mesh3.rotation.x += 0.0015;
      mesh3.rotation.y -= 0.0015;

      // Gentle Y-axis oscillation
      mesh1.position.y = Math.sin(time * 0.5) * 0.2;
      mesh2.position.y = 1 + Math.cos(time * 0.4) * 0.2;
      mesh3.position.y = -1.5 + Math.sin(time * 0.6) * 0.15;

      // Mouse Parallax easing
      targetX = mouseX * 0.05;
      targetY = mouseY * 0.05;
      
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (-targetY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // RESIZE HANDLER
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // CLEANUP
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", onDocumentMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
      
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose geometries & materials
      geometry1.dispose();
      geometry2.dispose();
      geometry3.dispose();
      materialCoral.dispose();
      materialViolet.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div 
      ref={mountRef} 
      className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden" 
    />
  );
}
