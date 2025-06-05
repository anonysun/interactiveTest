import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import MenuButton from './MenuButton';

interface MousePosition {
  x: number;
  y: number;
}

const LETTERS = [
  {
    char: 'W',
    image: 'https://images.unsplash.com/photo-1607499699372-7bb722dff7e2?w=1600&h=1600&fit=crop&auto=format',
    mask: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><text x="60" y="60" font-size="120" font-weight="900" font-family="Arial Black" text-anchor="middle" dominant-baseline="middle" fill="white">W</text></svg>')}`,
  },
  {
    char: 'A',
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1600&h=1600&fit=crop&auto=format',
    mask: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><text x="60" y="60" font-size="120" font-weight="900" font-family="Arial Black" text-anchor="middle" dominant-baseline="middle" fill="white">A</text></svg>')}`,
  },
  {
    char: 'R',
    image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1600&h=1600&fit=crop&auto=format',
    mask: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><text x="60" y="60" font-size="120" font-weight="900" font-family="Arial Black" text-anchor="middle" dominant-baseline="middle" fill="white">R</text></svg>')}`,
  },
  {
    char: 'H',
    image: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=1600&h=1600&fit=crop&auto=format',
    mask: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><text x="60" y="60" font-size="120" font-weight="900" font-family="Arial Black" text-anchor="middle" dominant-baseline="middle" fill="white">H</text></svg>')}`,
  },
  {
    char: 'O',
    image: 'https://images.unsplash.com/photo-1494122353634-c310f45a6d3c?w=1600&h=1600&fit=crop&auto=format',
    mask: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><text x="60" y="60" font-size="120" font-weight="900" font-family="Arial Black" text-anchor="middle" dominant-baseline="middle" fill="white">O</text></svg>')}`,
  },
  {
    char: 'L',
    image: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=1600&h=1600&fit=crop&auto=format',
    mask: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><text x="60" y="60" font-size="120" font-weight="900" font-family="Arial Black" text-anchor="middle" dominant-baseline="middle" fill="white">L</text></svg>')}`,
  },
];

const InteractivePage: React.FC = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredSection, setHoveredSection] = useState<'header' | 'main' | 'footer' | null>(null);
  const [hoveredLetter, setHoveredLetter] = useState<number | null>(null);
  const [imageX, setImageX] = useState<number[]>(LETTERS.map(() => 0));
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const animatingRef = useRef<boolean[]>(LETTERS.map(() => false));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleMouseEnter = (index: number) => {
    const width = letterRefs.current[index]?.offsetWidth || 0;
    if (animatingRef.current[index]) return;
    animatingRef.current[index] = true;
    setImageX(prev => {
      const next = [...prev];
      next[index] = -width;
      return next;
    });
    setHoveredLetter(index);
    setTimeout(() => {
      const animate = () => {
        setImageX(prev => {
          const next = [...prev];
          if (next[index] < 0) {
            next[index] = Math.min(next[index] + Math.max(8, width / 20), 0);
            requestAnimationFrame(animate);
          } else {
            next[index] = 0;
            animatingRef.current[index] = false;
          }
          return next;
        });
      };
      animate();
    }, 10);
  };

  const getCircleSize = () => {
    switch (hoveredSection) {
      case 'header':
        return '150px';
      case 'main':
        return '400px';
      case 'footer':
        return '150px';
      default:
        return '200px';
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .letter-container {
            position: relative;
            display: inline-block;
          }
          .letter-text {
            display: block;
            font-size: 20vw;
            line-height: 1;
            font-family: 'Arial Black', 'Helvetica Black', Impact, sans-serif;
            font-weight: 900;
            color: #FFF5EC;
            white-space: nowrap;
          }
          .letter-base {
            position: relative;
            z-index: 1;
            opacity: 1;
            transition: opacity 0.3s ease;
          }
          .letter-container:hover .letter-base {
            opacity: 0;
          }
          .letter-mask {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
          }
          .letter-container:hover .letter-mask {
            opacity: 1;
          }
          .letter-svg {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            overflow: visible;
          }
          .letter-image-container {
            position: absolute;
            inset: -50%;
            width: 200%;
            height: 200%;
            overflow: hidden;
          }
          .masked-text {
            opacity: 1 !important;
          }
        `}
      </style>

      {/* 마우스 따라다니는 원 */}
      <div
        className="pointer-events-none fixed z-50 h-[600px] w-[600px] transform-gpu"
        style={{
          left: `${mousePosition.x - 200}px`,
          top: `${mousePosition.y - 200}px`,
          background: 'radial-gradient(circle closest-side, rgba(255, 107, 107, 0.24), transparent)',
          transition: 'all 0.15s ease-out',
        }}
      />

      {/* 상단 네비게이션 */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-start p-8 text-[#FFF5EC] hover-section"
        onMouseEnter={() => setHoveredSection('header')}
        onMouseLeave={() => setHoveredSection(null)}
      >
        <div className="flex items-start space-x-16">
          <Link 
            to="/" 
            className="group text-sm font-light tracking-wide"
          >
            <span className="block transform transition-transform group-hover:translate-y-[-2px]">INDEX</span>
            <span className="block transform transition-transform group-hover:translate-y-[-2px]">4 ELVIS</span>
          </Link>
          <Link 
            to="/about" 
            className="group text-sm font-light tracking-wide"
          >
            <span className="block transform transition-transform group-hover:translate-y-[-2px]">Art</span>
            <span className="block transform transition-transform group-hover:translate-y-[-2px]">Tour</span>
          </Link>
          <Link 
            to="/interactive" 
            className="group text-sm font-light tracking-wide"
          >
            <span className="block transform transition-transform group-hover:translate-y-[-2px]">INTERACTIVE</span>
          </Link>
          <div className="text-sm font-light tracking-wide">
            <span className="block">11:00<span className="text-[10px] align-top ml-[2px]">AM</span></span>
            <span className="block">06:00<span className="text-[10px] align-top ml-[2px]">PM</span></span>
          </div>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 top-8">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 0L40 20L20 40L0 20L20 0Z" fill="#FFF5EC"/>
          </svg>
        </div>

        <div className="flex items-start space-x-16">
          <div className="text-sm font-light tracking-wide">
            <span className="block">hello@warholarts.com</span>
            <span className="block">[+420] 912 345 678</span>
          </div>
          <div className="text-sm font-light tracking-wide max-w-[200px]">
            <span className="block">Step into Warhol's iconic universe.</span>
            <span className="block">Limited tickets are on sale.</span>
          </div>
          {/* 햄버거 메뉴 버튼 영역 */}
          <div className="flex items-start space-x-8">
            <MenuButton />
          </div>
        </div>
      </nav>

      {/* 중앙 WARHOL 텍스트 */}
      <div
        className="relative z-10 flex h-screen items-center justify-center"
        onMouseEnter={() => setHoveredSection('main')}
        onMouseLeave={() => setHoveredSection(null)}
      >
        <div className="relative flex items-center justify-center">
          {LETTERS.map((letter, index) => {
            const maskId = `mask-${index}`;
            return (
              <div
                key={index}
                className="letter-container"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => setHoveredLetter(null)}
              >
                <span
                  className="letter-text letter-base"
                  ref={el => (letterRefs.current[index] = el)}
                >
                  {letter.char}
                </span>
                <div className="letter-mask">
                  <svg 
                    className="letter-svg"
                    width="100%"
                    height="100%"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <mask id={maskId}>
                        <rect x="-50%" y="-50%" width="200%" height="200%" fill="black" />
                        <text
                          className="masked-text"
                          x="50%"
                          y="50%"
                          dominantBaseline="central"
                          textAnchor="middle"
                          fill="white"
                          style={{
                            fontSize: '20vw',
                            fontFamily: 'Arial Black, Helvetica Black, Impact, sans-serif',
                            fontWeight: 900,
                          }}
                        >
                          {letter.char}
                        </text>
                      </mask>
                    </defs>
                    <image
                      href={letter.image}
                      width="100%"
                      height="100%"
                      x={imageX[index]}
                      y="0"
                      preserveAspectRatio="xMidYMid slice"
                      mask={`url(#${maskId})`}
                      style={{ transition: 'x 1.5s linear' }}
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 하단 정보 */}
      <div 
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 text-center text-sm font-light tracking-wide text-[#FFF5EC] hover-section"
        onMouseEnter={() => setHoveredSection('footer')}
        onMouseLeave={() => setHoveredSection(null)}
      >
        <div className="leading-relaxed">
          <span className="block transform transition-transform hover:translate-y-[-2px]">PRAGUE,</span>
          <span className="block transform transition-transform hover:translate-y-[-2px]">CZECH REPUBLIC,</span>
          <span className="block transform transition-transform hover:translate-y-[-2px]">2025</span>
        </div>
      </div>
    </div>
  );
};

export default InteractivePage; 