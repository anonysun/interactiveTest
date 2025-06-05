import React, { useEffect, useRef } from 'react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  delay: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, delay }) => (
  <div 
    className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 opacity-0 translate-y-10"
    style={{ transitionDelay: `${delay}ms` }}
  >
    <div className="w-12 h-12 mb-6 text-blue-500">
      <img src={icon} alt={title} className="w-full h-full object-contain" />
    </div>
    <h3 className="text-2xl font-bold mb-3 text-gray-900">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const ServiceSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (titleRef.current && cardsRef.current) {
        const titleRect = titleRef.current.getBoundingClientRect();
        const cardsRect = cardsRef.current.getBoundingClientRect();
        const viewHeight = window.innerHeight;

        // 제목 애니메이션
        if (titleRect.top <= viewHeight * 0.8) {
          titleRef.current.classList.remove('opacity-0', 'translate-y-10');
        }

        // 카드 애니메이션
        if (cardsRect.top <= viewHeight * 0.8) {
          const cards = cardsRef.current.children;
          Array.from(cards).forEach((card) => {
            card.classList.remove('opacity-0', 'translate-y-10');
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    {
      title: "간편송금",
      description: "은행 계좌 없이도 휴대폰 번호만으로 송금이 가능해요",
      icon: "/icons/transfer.svg"
    },
    {
      title: "투자",
      description: "주식부터 펀드까지 모든 투자를 한 곳에서 쉽게 시작해보세요",
      icon: "/icons/investment.svg"
    },
    {
      title: "신용관리",
      description: "내 신용점수를 무료로 확인하고 관리할 수 있어요",
      icon: "/icons/credit.svg"
    },
    {
      title: "보험",
      description: "가입한 보험을 한눈에 확인하고 보험금 청구도 쉽게",
      icon: "/icons/insurance.svg"
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={titleRef}
          className="text-center mb-20 transition-all duration-1000 opacity-0 translate-y-10"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            모든 금융 서비스를 한눈에
          </h2>
          <p className="text-xl text-gray-600">
            토스와 함께라면 어려울 것 없어요
          </p>
        </div>
        
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection; 