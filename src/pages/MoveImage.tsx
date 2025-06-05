import React, { useRef, useState } from 'react';

const GRID_ITEMS = [
  { 
    id: 0, 
    size: 'large', 
    orientation: 'landscape', 
    movement: 5,
    startColumn: 2,
    startRow: 3
  },
  { 
    id: 1, 
    size: 'small', 
    orientation: 'portrait', 
    movement: 20,
    startColumn: 12,
    startRow: 2
  },
  { 
    id: 2, 
    size: 'medium', 
    orientation: 'square', 
    movement: 10,
    startColumn: 17,
    startRow: 4
  },
  { 
    id: 3, 
    size: 'large', 
    orientation: 'portrait', 
    movement: 5,
    startColumn: 3,
    startRow: 10
  },
  { 
    id: 4, 
    size: 'small', 
    orientation: 'square', 
    movement: 20,
    startColumn: 16,
    startRow: 11
  },
  { 
    id: 5, 
    size: 'medium', 
    orientation: 'landscape', 
    movement: 10,
    startColumn: 12,
    startRow: 16
  }
];

const TRANSITION_SPEED = 0.1;
const TITLE_MOVEMENT = 15;

const MoveImage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    
    setMousePosition({ x, y });
  };

  const getImageSizeClasses = (size: string, orientation: string) => {
    const baseClasses = 'overflow-hidden ';
    
    if (orientation === 'landscape') {
      return `${baseClasses} w-[300px] h-[200px]`;
    } else if (orientation === 'portrait') {
      return `${baseClasses} w-[150px] h-[225px]`;
    } else {
      return `${baseClasses} w-[200px] h-[200px]`;
    }
  };

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <h1 
        className="absolute left-1/2 top-1/2 text-white text-5xl font-bold text-center z-10"
        style={{
          transform: `translate(calc(-50% + ${mousePosition.x * TITLE_MOVEMENT}px), calc(-50% + ${mousePosition.y * TITLE_MOVEMENT}px))`,
          transition: `transform ${TRANSITION_SPEED}s ease-out`
        }}
      >
        Interactive<br />Image Grid
      </h1>
      <div
        ref={containerRef}
        className="w-full h-full grid grid-cols-20 grid-rows-20 gap-4 p-8"
      >
        {GRID_ITEMS.map((item) => (
          <div 
            key={item.id}
            className={getImageSizeClasses(item.size, item.orientation)}
            style={{
              transform: `translate(${mousePosition.x * item.movement}px, ${mousePosition.y * item.movement}px)`,
              transition: `transform ${TRANSITION_SPEED}s ease-out`,
              gridColumn: `${item.startColumn} / span ${item.orientation === 'landscape' ? 8 : item.orientation === 'portrait' ? 4 : 6}`,
              gridRow: `${item.startRow} / span ${item.orientation === 'portrait' ? 5 : item.orientation === 'landscape' ? 3 : 4}`
            }}
          >
            <img
              src="/img/sample.jpg"
              alt={`Grid Image ${item.id + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoveImage; 