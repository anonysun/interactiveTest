import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// GSAP 플러그인 등록 (중복 등록 방지 필요 없음)
gsap.registerPlugin(ScrollTrigger);

// Z 모양 곡선 path
const DEFAULT_PATH =
  'M-2000,200 C600,100 1800,100 2200,200 Q1700,600 400,1000 T2200,2000';

interface ScribbleProps {
  pathData?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

const Scribble: React.FC<ScribbleProps> = ({
  pathData = DEFAULT_PATH,
  strokeColor = '#304ffe', // 더 진한 파랑
  strokeWidth = 16, // 더 두껍게
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    setTimeout(() => {
      const pathLength = path.getTotalLength();
      const dashLength = Math.ceil(pathLength) + 10; // path 길이보다 더 크게
      path.style.strokeDasharray = `${dashLength}`;
      path.style.strokeDashoffset = `${dashLength}`;

      ScrollTrigger.getAll().forEach(t => t.kill());

      gsap.fromTo(
        path,
        { strokeDashoffset: dashLength },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: svgRef.current,
            start: 'top 60%',
            end: 'bottom 20%',
            scrub: 1.2,
          },
        }
      );
    }, 0);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [pathData]);

  return (
    <div className="min-h-[250vh] flex flex-col items-center justify-start bg-[#f5f6fa] py-32 relative overflow-x-visible">
      <div className="relative w-full flex flex-col items-center justify-center" style={{height:'320px'}}>
        <h1 className="font-bold text-[#222] text-[7vw] md:text-[8vw] leading-none text-center z-10 relative" style={{fontFamily:'sans-serif'}}>Beyond Visions<br />Within Reach</h1>
        <svg
          ref={svgRef}
          width="2200"
          height="1000"
          viewBox="0 200 2200 1300"
          fill="none"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[2200px] h-[1300px] pointer-events-none z-0"
          style={{overflow:'visible'}}
        >
          <defs>
            <linearGradient id="scribble-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#304ffe" stopOpacity="1" />
              <stop offset="80%" stopColor="#304ffe" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#304ffe" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path
            ref={pathRef}
            d={pathData}
            stroke="url(#scribble-gradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 2px 12px #304ffe33)' }}
          />
        </svg>
      </div>
      <div className="mt-20 text-gray-500 text-lg">SCROLL TO EXPLORE</div>
    </div>
  );
};

export default Scribble; 