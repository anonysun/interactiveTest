import React, { useEffect, useRef, useState } from 'react';

interface TossSectionProps {
  imageUrl: string;
}

const TossSection: React.FC<TossSectionProps> = ({ imageUrl }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 페이지 진입 시 애니메이션
    const timers = [
      setTimeout(() => {
        if (line1Ref.current) {
          line1Ref.current.classList.remove('opacity-0', 'translate-y-10');
        }
      }, 500),
      setTimeout(() => {
        if (line2Ref.current) {
          line2Ref.current.classList.remove('opacity-0', 'translate-y-10');
        }
      }, 1000),
      setTimeout(() => {
        if (imageRef.current) {
          imageRef.current.classList.remove('opacity-0');
        }
      }, 300)  // 이미지를 먼저 보이게 함
    ];

    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  return (
    <div ref={sectionRef} className="relative w-full min-h-screen bg-white overflow-hidden">
      <div className="w-full max-w-[1200px] mx-auto relative pt-20">
        {/* 텍스트 섹션 */}
        <div 
          ref={textRef} 
          className="absolute z-10 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-gray-900 space-y-4"
        >
          <div 
            ref={line1Ref}
            className="transition-all duration-1000 ease-out opacity-0 "
          >
            <h1 className="text-5xl font-bold">금융의 모든 것</h1>
          </div>
          <div 
            ref={line2Ref}
            className="transition-all duration-1000 ease-out opacity-0 "
          >
            <h1 className="text-5xl font-bold">토스에서 쉽고 간편하게</h1>
          </div>
        </div>

        {/* 이미지 섹션 */}
        <div 
          ref={imageRef}
          className="relative w-full transition-all duration-1000 ease-out opacity-0" 
          style={{ aspectRatio: '16/9' }}
        >
          <img 
            src={imageUrl} 
            alt="Toss Section" 
            className="w-full h-full object-cover grayscale invert brightness-50" 
          />
        </div>
      </div>
    </div>
  );
};

export default TossSection;