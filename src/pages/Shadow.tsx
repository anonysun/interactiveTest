import React, { useEffect } from 'react';
import * as THREE from 'three';

const Shadow: React.FC = () => {
  useEffect(() => {
    // 장면 생성
    const scene = new THREE.Scene();

    // 카메라 설정
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // 렌더러 생성
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 애니메이션 루프
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // 클린업
    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null;
};

export default Shadow;