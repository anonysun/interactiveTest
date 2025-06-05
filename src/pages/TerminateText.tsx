import React, { useState, useEffect, useRef } from 'react';

interface TerminateTextProps {
  text: string;
  className?: string;
}

const TerminateText: React.FC<TerminateTextProps> = ({ text, className = '' }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [activeColor, setActiveColor] = useState('');

  const scrambleChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
  const colors = ['text-green-400', 'text-blue-400', 'text-purple-400', 'text-yellow-400'];

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrambleCountRef = useRef(0);

  const getRandomChar = () => scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

  const animate = () => {
    if (!isAnimating) return;

    if (activeIndex >= text.length) {
      setIsAnimating(false);
      setActiveIndex(-1);
      setActiveColor('');
      setDisplayText(text);
      return;
    }

    const chars = text.split('').map((char, i) => {
      if (i < activeIndex) return char;
      if (i === activeIndex) return scrambleCountRef.current < 5 ? getRandomChar() : text[i];
      return '';
    });

    setDisplayText(chars.join(''));
    
    if (scrambleCountRef.current < 5) {
      setActiveColor(getRandomColor());
      scrambleCountRef.current++;
    } else {
      setActiveColor('');
      setActiveIndex(prev => prev + 1);
      scrambleCountRef.current = 0;
    }

    timeoutRef.current = setTimeout(animate, 50);
  };

  useEffect(() => {
    if (isAnimating) {
      animate();
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isAnimating, activeIndex]);

  const startAnimation = () => {
    if (!isAnimating) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setActiveIndex(0);
      scrambleCountRef.current = 0;
      setIsAnimating(true);
    } else {
      animate();
    }
  };

  return (
    <span
      className="inline-block font-mono cursor-pointer select-none"
      onMouseEnter={startAnimation}
    >
      {displayText.split('').map((char, i) => (
        <span
          key={i}
          className={`${i === activeIndex ? activeColor : 'text-gray-300'} ${className}`}
        >
          {char || '\u00A0'}
        </span>
      ))}
    </span>
  );
};

export default TerminateText; 