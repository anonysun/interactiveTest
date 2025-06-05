import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import CardNavigation from './CardNavigation';

const cardData = [
  { id: 1, title: 'Card 1', content: 'This is the first card.', icon: '🔥' },
  { id: 2, title: 'Card 2', content: 'This is the second card.', icon: '🌟' },
  { id: 3, title: 'Card 3', content: 'This is the third card.', icon: '✨' },
  { id: 4, title: 'Card 4', content: 'This is the fourth card.', icon: '🔥' },
];

const CardStackContainer: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleCardClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      {cardData.map((card, index) => (
        <Card
          key={card.id}
          data={card}
          isActive={index === activeIndex}
          index={index}
          activeIndex={activeIndex}
        />
      ))}
      <CardNavigation
        cardData={cardData}
        activeIndex={activeIndex}
        onCardClick={handleCardClick}
      />
    </div>
  );
};

export default CardStackContainer;
