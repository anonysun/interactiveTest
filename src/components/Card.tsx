import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  data: { id: number; title: string; content: string; icon: string };
  isActive: boolean;
  index: number;
  activeIndex: number;
}

const Card: React.FC<CardProps> = ({ data, isActive, index, activeIndex }) => {
  const offset = index - activeIndex;

  const variants = {
    active: { x: 0, y: 0, scale: 1, rotate: 0, zIndex: 10, opacity: 1 },
    inactive: {
      x: offset * 20,
      y: offset * 10,
      scale: 0.9 - Math.abs(offset) * 0.05,
      rotate: offset * 5,
      zIndex: 10 - Math.abs(offset),
      opacity: 1 - Math.abs(offset) * 0.15,
    },
  };

  return (
    <motion.div
      className="absolute w-64 h-96 bg-gradient-to-br from-white to-gray-100 shadow-lg rounded-lg flex flex-col items-center justify-center"
      animate={isActive ? 'active' : 'inactive'}
      variants={variants}
      transition={{ 
        duration: 0.5, 
        ease: 'easeInOut',
        scale: {
          type: 'spring',
          damping: 15
        }
      }}
      whileHover={{ scale: isActive ? 1.05 : 1 }}
    >
      <div className="text-4xl mb-6">{data.icon}</div>
      <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
        {data.title}
      </h2>
      <p className="text-gray-600 text-center px-6">{data.content}</p>
    </motion.div>
  );
};

export default Card;
