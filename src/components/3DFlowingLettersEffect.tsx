import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// 쉐이더 코드를 상수로 분리
const vertexShader = `
  uniform float time;
  uniform sampler2D depthMap;
  uniform vec2 mousePos;
  uniform vec2 resolution;
  uniform vec2 imageResolution;  // 배경 이미지의 실제 해상도
  
  varying vec2 vUv;
  varying float vDepth;
  
  void main() {
    vUv = uv;
    vec3 newPosition = position;
    newPosition.xy += mousePos;
    
    // 화면상의 위치를 이미지의 UV 좌표로 변환
    vec2 screenPos = (newPosition.xy + resolution * 0.5) / resolution;
    
    // 화면 비율과 이미지 비율 계산
    float screenAspect = resolution.x / resolution.y;
    float imageAspect = imageResolution.x / imageResolution.y;
    
    // UV 좌표 조정
    vec2 adjustedUV = screenPos;
    if (screenAspect > imageAspect) {
      // 화면이 더 넓은 경우
      float scale = screenAspect / imageAspect;
      adjustedUV.x = (adjustedUV.x - 0.5) * scale + 0.5;
    } else {
      // 화면이 더 높은 경우
      float scale = imageAspect / screenAspect;
      adjustedUV.y = (adjustedUV.y - 0.5) * scale + 0.5;
    }
    
    // UV 좌표를 Y축으로 뒤집기
    vec2 depthUV = vec2(adjustedUV.x, 1.0 - adjustedUV.y);
    float depth = texture2D(depthMap, depthUV).r;
    vDepth = depth;
    
    // 깊이값을 이용한 Y축 변위
    float heightScale = 30.0;  // 100.0에서 줄임
    newPosition.y -= depth * heightScale;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D textTexture;
  varying vec2 vUv;
  varying float vDepth;
  
  void main() {
    vec4 textColor = texture2D(textTexture, vUv);
    vec3 gray = vec3(0,0,0); // 회색으로 변경
    gl_FragColor = vec4(gray, textColor.r);
  }
`;

// 깊이 맵 생성 함수
const createDepthMap = (image: HTMLImageElement): THREE.DataTexture => {
  // 원본 이미지 비율 계산
  const imageAspect = image.width / image.height;
  
  // 정확한 비율을 위해 높이를 먼저 설정하고 너비를 계산
  const targetHeight = 1024;
  // 정수 반올림 대신 실제 비율 사용
  const exactWidth = targetHeight * imageAspect;
  // 텍스처 크기는 정수여야 하므로, 가장 가까운 정수로 반올림
  const targetWidth = Math.round(exactWidth);
  
  console.log('깊이맵 정확한 너비:', exactWidth);
  console.log('깊이맵 생성 크기:', targetWidth, 'x', targetHeight);
  console.log('깊이맵 목표 비율:', imageAspect);
  console.log('깊이맵 실제 비율:', targetWidth / targetHeight);
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  // 캔버스 크기 설정
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  
  // 캔버스 초기화
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  
  // 이미지를 캔버스에 그리기
  ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
  
  // 깊이 데이터 생성
  const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  const data = imageData.data;
  const depthData = new Float32Array(targetWidth * targetHeight);
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
    depthData[i / 4] = brightness;
  }
  
  // 깊이 텍스처 생성
  const depthTexture = new THREE.DataTexture(
    depthData,
    targetWidth,
    targetHeight,
    THREE.RedFormat,
    THREE.FloatType
  );
  
  depthTexture.minFilter = THREE.LinearFilter;
  depthTexture.magFilter = THREE.LinearFilter;
  depthTexture.needsUpdate = true;
  
  return depthTexture;
};

const FlowingLettersEffect: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  const depthMapRef = useRef<THREE.Texture | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const mousePos = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  const resolution = useRef<THREE.Vector2>(new THREE.Vector2(window.innerWidth, window.innerHeight));
  const bgMeshRef = useRef<THREE.Mesh | null>(null);
  const showDepthMap = useRef<boolean>(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // 렌더러 초기화
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 씬 초기화
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 카메라 초기화
    const camera = new THREE.OrthographicCamera(
      -window.innerWidth / 2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      -window.innerHeight / 2,
      1,
      1000
    );
    camera.position.z = 100;
    cameraRef.current = camera;

    let animationFrameId: number;

    // 깊이맵 시각화를 위한 배경 메시 머티리얼
    const createBgMaterial = (texture: THREE.Texture, depthTexture: THREE.Texture) => {
      return new THREE.ShaderMaterial({
        uniforms: {
          mainTexture: { value: texture },
          depthTexture: { value: depthTexture },
          showDepth: { value: false }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D mainTexture;
          uniform sampler2D depthTexture;
          uniform bool showDepth;
          varying vec2 vUv;
          
          void main() {
            vec2 depthUV = vec2(vUv.x, 1.0 - vUv.y);
            if (showDepth) {
              float depth = texture2D(depthTexture, depthUV).r;
              gl_FragColor = vec4(vec3(depth), 1.0);
            } else {
              gl_FragColor = texture2D(mainTexture, vUv);
            }
          }
        `
      });
    };

    // 텍스처 로드
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      process.env.PUBLIC_URL + '/img/bg.JPG',
      (texture) => {
        console.log('이미지 로드 성공!');
        console.log('원본 텍스처 크기:', texture.image.width, 'x', texture.image.height);
        console.log('원본 텍스처 비율:', texture.image.width / texture.image.height);
        
        // 텍스처 설정
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        textureRef.current = texture;

        // 이미지 비율 계산 (원본 이미지 기준)
        const imageAspect = texture.image.width / texture.image.height;
        const screenAspect = window.innerWidth / window.innerHeight;
        
        console.log('이미지 비율:', imageAspect);
        console.log('화면 비율:', screenAspect);

        // 화면에 맞는 배경 크기 계산 (정확한 비율 유지)
        let bgWidth, bgHeight;
        
        if (screenAspect > imageAspect) {
          // 화면이 더 넓은 경우, 높이에 맞추고 가로 조정
          bgHeight = window.innerHeight;
          bgWidth = bgHeight * imageAspect;
        } else {
          // 화면이 더 높은 경우, 너비에 맞추고 세로 조정
          bgWidth = window.innerWidth;
          bgHeight = bgWidth / imageAspect;
        }
        
        console.log('계산된 배경 크기:', bgWidth, 'x', bgHeight);
        console.log('계산된 배경 비율:', bgWidth / bgHeight);
        console.log('원본 비율과 차이:', Math.abs(bgWidth / bgHeight - imageAspect));

        // 깊이 맵 생성
        const depthTexture = createDepthMap(texture.image);
        depthMapRef.current = depthTexture;

        // 배경 메시 생성
        const bgGeometry = new THREE.PlaneGeometry(bgWidth, bgHeight);
        const bgMaterial = createBgMaterial(texture, depthTexture);
        const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
        bgMesh.position.z = -10;  // z 위치 조정
        bgMesh.position.y = 0;    // y 위치 리셋
        scene.add(bgMesh);
        bgMeshRef.current = bgMesh;

        // 텍스트 캔버스 생성
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = 2048;
        canvas.height = 256;
        
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const text = "SPACE OPEN";
        ctx.font = 'bold 150px Arial';  // 200px에서 150px로 줄임
        ctx.fillStyle = '#FFFF00';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        
        const textTexture = new THREE.CanvasTexture(canvas);
        textTexture.minFilter = THREE.LinearFilter;
        textTexture.magFilter = THREE.LinearFilter;

        // 텍스트 메시 생성
        const textGeometry = new THREE.PlaneGeometry(600, 75, 50, 1);  // 크기를 800x100에서 600x75로 줄임
        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            depthMap: { value: depthTexture },
            mousePos: { value: mousePos.current },
            resolution: { value: resolution.current },
            imageResolution: { value: new THREE.Vector2(texture.image.width, texture.image.height) },
            textTexture: { value: textTexture }
          },
          vertexShader,
          fragmentShader,
          transparent: true,
          side: THREE.DoubleSide,
          blending: THREE.NormalBlending
        });

        materialRef.current = material;

        const textMesh = new THREE.Mesh(textGeometry, material);
        textMesh.position.z = 10;
        scene.add(textMesh);

        // 애니메이션 루프
        let time = 0;
        const animate = () => {
          animationFrameId = requestAnimationFrame(animate);
          
          if (materialRef.current) {
            time += 0.016;
            materialRef.current.uniforms.time.value = time;
            materialRef.current.uniforms.mousePos.value.copy(mousePos.current);
          }

          renderer.render(scene, camera);
        };
        animate();
      },
      // 로딩 진행 상황
      (xhr) => {
        console.log('이미지 로딩 진행률:', (xhr.loaded / xhr.total * 100) + '%');
      },
      // 에러 처리
      (error) => {
        console.error('이미지 로드 실패:', error);
        console.log('현재 작업 디렉토리:', window.location.href);
      }
    );

    // 윈도우 리사이즈 이벤트 처리
    const handleResize = () => {
      if (rendererRef.current && cameraRef.current && bgMeshRef.current && textureRef.current) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        rendererRef.current.setSize(width, height);
        
        cameraRef.current.left = -width / 2;
        cameraRef.current.right = width / 2;
        cameraRef.current.top = height / 2;
        cameraRef.current.bottom = -height / 2;
        cameraRef.current.updateProjectionMatrix();
        
        resolution.current.set(width, height);
        
        // 배경 크기 재계산
        const imageAspect = textureRef.current.image.width / textureRef.current.image.height;
        const screenAspect = width / height;
        
        let bgWidth = width;
        let bgHeight = height;
        
        if (screenAspect > imageAspect) {
          bgWidth = height * imageAspect;
        } else {
          bgHeight = width / imageAspect;
        }
        
        bgMeshRef.current.scale.set(bgWidth / window.innerWidth, bgHeight / window.innerHeight, 1);
        
        if (materialRef.current) {
          materialRef.current.uniforms.resolution.value.copy(resolution.current);
        }
      }
    };
    window.addEventListener('resize', handleResize);

    // 마우스 이벤트 처리
    const handleMouseMove = (event: MouseEvent) => {
      const x = event.clientX - window.innerWidth / 2;
      const y = -(event.clientY - window.innerHeight / 2);
      
      mousePos.current.x += (x - mousePos.current.x) * 0.1;
      mousePos.current.y += (y - mousePos.current.y) * 0.1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 마우스 클릭 이벤트 처리
    const handleClick = () => {
      if (bgMeshRef.current && bgMeshRef.current.material instanceof THREE.ShaderMaterial) {
        const material = bgMeshRef.current.material;
        material.uniforms.showDepth.value = !material.uniforms.showDepth.value;
      }
    };
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0
      }}
    />
  );
};

export default FlowingLettersEffect; 