import React, { useEffect, useRef, useState } from 'react';

interface ScrollSectionProps {
  p1ImageUrl: string;
  p2ImageUrl: string;
}

const ScrollSection: React.FC<ScrollSectionProps> = ({ p1ImageUrl, p2ImageUrl }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [p1Height, setP1Height] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const p1Ref = useRef<HTMLDivElement>(null);
  const p2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
    };

    const updateP1Height = () => {
      if (p1Ref.current) {
        const height = p1Ref.current.offsetHeight;
        setP1Height(height);
      }
    };

    // 이미지 로드 후 높이 계산
    const p1Image = new Image();
    p1Image.src = p1ImageUrl;
    p1Image.onload = updateP1Height;

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateP1Height);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateP1Height);
    };
  }, [p1ImageUrl]);

  useEffect(() => {
    if (!sectionRef.current || !p1Ref.current || !p2Ref.current) return;

    const p1Element = p1Ref.current;
    const p2Element = p2Ref.current;
    const meetingPoint = p1Height;

    if (scrollPosition < meetingPoint) {
      // P1은 고정, P2는 아래에서 올라옴
      p1Element.style.position = 'fixed';
      p1Element.style.top = '0';
      p1Element.style.left = '50%';
      p1Element.style.transform = 'translateX(-50%)';
      p1Element.style.width = '100%';
      p1Element.style.maxWidth = '1200px';
      
      // P2는 스크롤에 따라 올라옴
      p2Element.style.position = 'absolute';
      p2Element.style.top = `${meetingPoint}px`;
      p2Element.style.left = '50%';
      p2Element.style.transform = `translate(-50%, ${Math.max(window.innerHeight - scrollPosition, 0)}px)`;
      p2Element.style.width = '100%';
      p2Element.style.maxWidth = '1200px';
    } else {
      // P1과 P2가 만나서 함께 스크롤
      p1Element.style.position = 'absolute';
      p1Element.style.top = `${meetingPoint}px`;
      p1Element.style.left = '50%';
      p1Element.style.transform = `translate(-50%, -${scrollPosition - meetingPoint}px)`;
      p1Element.style.width = '100%';
      p1Element.style.maxWidth = '1200px';
      
      // P2도 함께 스크롤
      p2Element.style.position = 'absolute';
      p2Element.style.top = `${meetingPoint + p1Height}px`;
      p2Element.style.left = '50%';
      p2Element.style.transform = `translate(-50%, -${scrollPosition - meetingPoint}px)`;
      p2Element.style.width = '100%';
      p2Element.style.maxWidth = '1200px';
    }
  }, [scrollPosition, p1Height]);

  return (
    <div ref={sectionRef} className="relative w-full" style={{ minHeight: `${p1Height * 3 + 2000}px` }}>
      <div ref={p1Ref} className="w-full max-w-[1200px] mx-auto bg-white" style={{ zIndex: 2 }}>
        <img 
          src={p1ImageUrl} 
          alt="P1" 
          className="w-full h-auto" 
        />
      </div>
      <div ref={p2Ref} className="w-full max-w-[1200px] mx-auto" style={{ zIndex: 1, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        <img 
          src={p2ImageUrl} 
          alt="P2" 
          className="w-full h-auto" 
        />
        <div className="w-full h-[2000px] bg-white"></div>
      </div>
    </div>
  );
};

export default ScrollSection; 