import React, { useEffect, useRef } from 'react';

interface FeatureProps {
  title: string;
  description: string;
  imageUrl: string;
  isReversed?: boolean;
}

const Feature: React.FC<FeatureProps> = ({ title, description, imageUrl, isReversed }) => {
  const featureRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (featureRef.current && textRef.current && imageRef.current) {
        const rect = featureRef.current.getBoundingClientRect();
        const viewHeight = window.innerHeight;

        if (rect.top <= viewHeight * 0.8) {
          textRef.current.classList.remove('opacity-0', isReversed ? 'translate-x-10' : '-translate-x-10');
          imageRef.current.classList.remove('opacity-0', isReversed ? '-translate-x-10' : 'translate-x-10');
        }
      }
    };

    // 초기 로드 시 한 번 실행
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isReversed]);

  return (
    <div 
      ref={featureRef}
      className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 py-24`}
    >
      <div 
        ref={textRef}
        className={`flex-1 transition-all duration-1000 ease-out opacity-0 ${isReversed ? 'translate-x-10' : '-translate-x-10'}`}
      >
        <h2 className="text-4xl font-bold mb-6 text-gray-900 whitespace-pre-line">{title}</h2>
        <p className="text-xl text-gray-600 leading-relaxed">{description}</p>
      </div>
      <div 
        ref={imageRef}
        className={`flex-1 transition-all duration-1000 ease-out opacity-0 ${isReversed ? '-translate-x-10' : 'translate-x-10'}`}
      >
        <div className="aspect-[16/9] overflow-hidden rounded-2xl">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureSection: React.FC = () => {
  const features = [
    {
      title: "모든 금융 서비스를\n한 앱에서",
      description: "송금, 결제, 투자까지. 토스 하나면 복잡한 금융 생활이 놀랍도록 간단해집니다.",
      imageUrl: "/img/sample.jpg"
    },
    {
      title: "누구나 쉽게 시작하는\n투자 생활",
      description: "처음이라 어려울 수 있는 투자, 토스가 알기 쉽게 알려드립니다. 주식부터 펀드까지 다양한 투자 상품을 경험해보세요.",
      imageUrl: "/img/sample.jpg",
      isReversed: true
    },
    {
      title: "내 돈 관리,\n이제 한눈에",
      description: "여러 은행에 흩어져 있는 내 돈, 토스에서 한 번에 조회하고 관리할 수 있습니다.",
      imageUrl: "/img/sample.jpg"
    }
  ];

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {features.map((feature, index) => (
          <Feature
            key={index}
            title={feature.title}
            description={feature.description}
            imageUrl={feature.imageUrl}
            isReversed={feature.isReversed}
          />
        ))}
      </div>
    </section>
  );
};

export default FeatureSection; 