import React, { useEffect, useRef } from 'react';

interface StatItemProps {
  number: string;
  label: string;
  delay?: number;
}

const StatItem: React.FC<StatItemProps> = ({ number, label, delay = 0 }) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (itemRef.current) {
        const rect = itemRef.current.getBoundingClientRect();
        const viewHeight = window.innerHeight;

        if (rect.top <= viewHeight * 0.8) {
          setTimeout(() => {
            itemRef.current?.classList.remove('opacity-0', 'translate-y-10');
          }, delay);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [delay]);

  return (
    <div 
      ref={itemRef}
      className="flex flex-col items-center transition-all duration-1000 ease-out opacity-0 translate-y-10"
    >
      <div className="text-5xl font-bold text-blue-500 mb-2">{number}</div>
      <div className="text-lg text-gray-600 text-center max-w-[180px]">{label}</div>
    </div>
  );
};

const TrustSection: React.FC = () => {
  const stats = [
    {
      number: "2,000만 명",
      label: "함께하는 사용자"
    },
    {
      number: "99.9%",
      label: "서비스 안정성"
    },
    {
      number: "24시간",
      label: "보안 모니터링"
    },
    {
      number: "금융위원회",
      label: "공식 인증 전자금융업자"
    }
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current && titleRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const viewHeight = window.innerHeight;

        if (rect.top <= viewHeight * 0.8) {
          titleRef.current.classList.remove('opacity-0', 'translate-y-10');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={titleRef}
          className="text-center mb-16 transition-all duration-1000 ease-out opacity-0 translate-y-10"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            믿을 수 있는 금융파트너
          </h2>
          <p className="text-xl text-gray-600">
            2,000만 사용자가 선택한 혁신금융
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              number={stat.number}
              label={stat.label}
              delay={index * 200}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection; 