import React from 'react';

interface CardNavigationProps {
  cardData: { id: number; title: string; content: string; icon: string }[];
  activeIndex: number;
  onCardClick: (index: number) => void;
}

const CardNavigation: React.FC<CardNavigationProps> = ({ cardData, activeIndex, onCardClick }) => {
  return (
    <div className="absolute bottom-8 flex space-x-4">
      {cardData.map((card, index) => (
        <button
          key={card.id}
          onClick={() => onCardClick(index)}
          className={`w-4 h-4 rounded-full ${
            index === activeIndex ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export default CardNavigation;
