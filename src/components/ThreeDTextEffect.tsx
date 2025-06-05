import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import type { Font } from 'three/examples/jsm/loaders/FontLoader';

// TextGeometry 타입 선언 추가
declare module 'three/examples/jsm/geometries/TextGeometry' {
  interface TextGeometryParameters {
    font: Font;
    size?: number;
    height?: number;
    curveSegments?: number;
    bevelEnabled?: boolean;
    bevelThickness?: number;
    bevelSize?: number;
    bevelOffset?: number;
    bevelSegments?: number;
  }
}

const ThreeDTextEffect: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const textMeshRef = useRef<THREE.Mesh | null>(null);
  const reqIdRef = useRef<number | null>(null);
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  // 마우스 이벤트 핸들러들
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    previousMousePosition.current = {
      x: event.clientX,
      y: event.clientY
    };
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    const deltaX = (event.clientX - previousMousePosition.current.x) / 100;
    const deltaY = (event.clientY - previousMousePosition.current.y) / 100;

    mouse.current.x += deltaX;
    mouse.current.y += deltaY;

    // 회전 각도 제한
    mouse.current.x = Math.max(-2, Math.min(2, mouse.current.x));
    mouse.current.y = Math.max(-2, Math.min(2, mouse.current.y));

    previousMousePosition.current = {
      x: event.clientX,
      y: event.clientY
    };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Initialize scene
    sceneRef.current = new THREE.Scene();
    sceneRef.current.background = new THREE.Color(0x000000);

    // Initialize camera
    const aspect = mount.clientWidth / mount.clientHeight;
    cameraRef.current = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    cameraRef.current.position.z = 5;

    // Initialize renderer
    rendererRef.current = new THREE.WebGLRenderer({
      antialias: true
    });
    rendererRef.current.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(rendererRef.current.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    sceneRef.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 1, 1);
    sceneRef.current.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-5, 5, 5);
    sceneRef.current.add(pointLight);

    // Load font and create text
    const fontLoader = new FontLoader();
    fontLoader.load(
      '/font/helvetiker_bold.typeface.json',
      (font: Font) => {
        // Create text geometries for each word
        const textGeometry = new TextGeometry('3D', {
          font: font,
          size: 70,
          height: 20,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 10,
          bevelSize: 8,
          bevelOffset: 0,
          bevelSegments: 5
        });

        // Center the geometry
        textGeometry.computeBoundingBox();

        const width = textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x;
        const height = textGeometry.boundingBox!.max.y - textGeometry.boundingBox!.min.y;

        // Position the text
        textGeometry.translate(-width / 2, height / 2, 0);

        // Create material
        const textMaterial = new THREE.MeshPhongMaterial({ 
          color: 0x00ff00,
          shininess: 100,
        });

        // Create mesh
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMeshRef.current = textMesh;

        // Add mesh to scene
        sceneRef.current?.add(textMesh);
      },
      undefined,
      (err: unknown) => {
        console.error('Error loading font:', err);
      }
    );

    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !textMeshRef.current) return;

      // 텍스트 메시의 회전 및 위치 업데이트
      const mesh = textMeshRef.current;
      const targetX = (mouse.current.x * mount.clientWidth) / 2;
      const targetY = (mouse.current.y * mount.clientHeight) / 2;

      mesh.position.x += (targetX - mesh.position.x) * 0.1;
      mesh.position.y += (targetY - mesh.position.y) * 0.1;

      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      reqIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup function
    return () => {
      // Cancel animation frame
      if (reqIdRef.current) {
        cancelAnimationFrame(reqIdRef.current);
      }

      // Dispose of geometries and materials
      if (textMeshRef.current) {
        textMeshRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            }
          }
        });
      }

      // Dispose of renderer and remove canvas
      if (rendererRef.current) {
        rendererRef.current.dispose();
        
        const canvas = rendererRef.current.domElement;
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
    };

  }, []);

  return (
    <div 
      ref={mountRef}
      className="w-full h-screen bg-transparent cursor-grab active:cursor-grabbing"
      style={{ overflow: 'hidden' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    />
  );
};

export default ThreeDTextEffect; 