import React, { useEffect, useRef, useState } from 'react';
import HoverButton from './HoverButton';

interface ExpandSectionProps {
  imageUrl?: string;
}

const ExpandSection: React.FC<ExpandSectionProps> = ({ imageUrl = '/img/sample.jpg' }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // 화면 하단에서 시작해서 화면 20% 위치에서 끝남
      const startPoint = viewportHeight;
      const endPoint = viewportHeight * 0.2;
      
      const current = rect.top;
      const total = startPoint - endPoint;
      
      let calculatedProgress = (startPoint - current) / total;
      calculatedProgress = Math.max(0, Math.min(1, calculatedProgress));

      setProgress(calculatedProgress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 컨테이너는 60%에서 100%로 늘어남
  const containerWidth = 60 + (100 - 60) * progress;

  return (
    <div
      ref={sectionRef}
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#999',
      }}
    >
      <div
        style={{
          width: `${containerWidth}%`,
          height: '60vh',
          position: 'relative',
          overflow: 'hidden',
          transition: 'width 0.1s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <img
            src={imageUrl}
            alt="꼭 필요했던 금융"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </div>
      </div>
      <div className="absolute bottom-20">
        <HoverButton text="자세히 보기" />
      </div>
    </div>
  );
};

export default ExpandSection; 