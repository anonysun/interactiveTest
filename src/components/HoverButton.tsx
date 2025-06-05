import React, { useEffect, useRef, useState } from 'react';

interface HoverButtonProps {
  text: string;
  onClick?: () => void;
}

interface AnimationPoint {
  x: number;
  y: number;
  type: 'enter' | 'leave';
}

const HoverButton: React.FC<HoverButtonProps> = ({ text, onClick }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [animationPoint, setAnimationPoint] = useState<AnimationPoint | null>(null);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const ANIMATION_DURATION = 300; // 1초

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) startTimeRef.current = currentTime;
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (animationPoint) {
        const maxRadius = Math.sqrt(
          Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2)
        );
        
        const currentRadius = maxRadius * (
          animationPoint.type === 'enter' ? progress : 1 - progress
        );

        // Draw circle
        ctx.beginPath();
        ctx.arc(
          animationPoint.x,
          animationPoint.y,
          currentRadius,
          0,
          2 * Math.PI
        );
        ctx.fillStyle = '#000000';
        ctx.fill();
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    if (animationPoint) {
      startTimeRef.current = 0;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animationPoint]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsHovered(true);
    setAnimationPoint({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      type: 'enter'
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsHovered(false);
    setAnimationPoint({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      type: 'leave'
    });
  };

  return (
    <button
      ref={buttonRef}
      className="relative w-[180px] h-[50px] border border-gray-200 group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ overflow: 'hidden' }}
    >
      <canvas
        ref={canvasRef}
        width={180}
        height={50}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
      <span
        className={`relative z-10 flex items-center justify-center gap-1 transition-colors duration-150
          ${isHovered ? 'text-white' : 'text-gray-200'}`}
      >
        {text}
        <span className="text-lg">+</span>
      </span>
    </button>
  );
};

export default HoverButton; 