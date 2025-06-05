import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

const BWtoColor: React.FC = () => {
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const circleSize = useRef<number>(100);
  const lastPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastTime = useRef<number>(Date.now());
  const baseSize = useRef<number>(100);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  // 애니메이션 최적화
  useEffect(() => {
    let startTime = Date.now();
    let lastRender = 0;
    const FRAME_RATE = 1000 / 30; // 30fps로 제한

    const easeInOut = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };

    const heartbeatEffect = (t: number): number => {
      // 첫 번째 수축 (0~0.15)
      if (t < 0.15) {
        return easeInOut(t / 0.15);
      }
      // 첫 번째 이완 (0.15~0.3)
      if (t < 0.3) {
        return easeInOut(1 - (t - 0.15) / 0.15);
      }
      // 두 번째 수축 (0.3~0.45)
      if (t < 0.45) {
        return 0.8 * easeInOut((t - 0.3) / 0.15);
      }
      // 두 번째 이완 (0.45~0.6)
      if (t < 0.6) {
        return 0.8 * easeInOut(1 - (t - 0.45) / 0.15);
      }
      // 휴지기 (0.6~1.0)
      return 0;
    };

    const animate = (timestamp: number) => {
      if (!isHovering) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      // 프레임 레이트 제한
      if (timestamp - lastRender < FRAME_RATE) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const elapsed = (Date.now() - startTime) / 1000; // 1초 주기
      const progress = elapsed % 1; // 0~1 사이 값으로 변환
      const effect = heartbeatEffect(progress);
      const breathingEffect = effect * 12; // 최대 12px 변화

      circleSize.current = Math.max(20, Math.min(200, baseSize.current + breathingEffect));

      if (containerRef.current) {
        containerRef.current.style.setProperty(
          '--clip-path',
          `circle(${circleSize.current}px at ${mousePos.x}% ${mousePos.y}%)`
        );
      }

      lastRender = timestamp;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isHovering, mousePos]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovering || !e.currentTarget) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const currentTime = Date.now();
    const timeDiff = currentTime - lastTime.current;
    
    if (timeDiff < 16) return; // 약 60fps로 제한

    const xDiff = x - lastPos.current.x;
    const yDiff = y - lastPos.current.y;
    const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    const speed = distance / timeDiff;

    baseSize.current = Math.min(200, Math.max(20, 100 + speed * 800));
    setMousePos({ x, y });
    
    lastPos.current = { x, y };
    lastTime.current = currentTime;
  }, [isHovering]);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    baseSize.current = 100;
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setMousePos({ x: 50, y: 50 });
    baseSize.current = 100;
    circleSize.current = 0;
    if (containerRef.current) {
      containerRef.current.style.setProperty('--clip-path', 'circle(0px at 50% 50%)');
    }
  }, []);

  const colorImageStyle = useMemo(() => ({
    backgroundImage: 'url(/img/pic2.jpg)',
  }), []);

  const bwImageStyle = useMemo(() => ({
    backgroundImage: 'url(/img/pic1.jpg)',
  }), []);

  return (
    <div className="w-full h-screen overflow-hidden bg-black relative">
      <Link 
        to="/" 
        className="absolute top-8 left-8 text-gray-200 hover:text-white transition-colors z-20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </Link>
      
      <div 
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* 흑백 이미지 배경 */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale"
          style={bwImageStyle}
        />
        
        {/* 컬러 이미지 오버레이 */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            ...colorImageStyle,
            clipPath: 'var(--clip-path)',
            transition: isHovering ? 'none' : 'clip-path 0.3s ease-out',
          }}
        />

        {/* 텍스트 오버레이 */}
        <div className="relative z-10 text-center px-4 pointer-events-none">
          <h1 className="text-6xl font-bold text-white mb-6 tracking-wider">
            BW to COLOR
          </h1>
          <p className="text-2xl text-white">
            마우스를 움직여 컬러를 표시해보세요
          </p>
        </div>
      </div>
    </div>
  );
};

export default BWtoColor; 