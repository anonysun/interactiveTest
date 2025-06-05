import React, { useEffect, useRef } from 'react';

interface Letter {
  char: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

const FlowingLettersEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const letters = useRef<Letter[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number>();
  const backgroundImage = useRef<HTMLImageElement | null>(null);
  const imageLoaded = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    console.log('Canvas initialized');

    // 이미지 로드
    backgroundImage.current = new Image();
    backgroundImage.current.src = '/img/circle.png';
    
    backgroundImage.current.onload = () => {
      console.log('Image loaded successfully');
      console.log('Image dimensions:', backgroundImage.current?.width, 'x', backgroundImage.current?.height);
      imageLoaded.current = true;
      initLetters(); // 이미지 로드 후 글자 초기화
    };

    backgroundImage.current.onerror = (e) => {
      console.error('Error loading image:', e);
    };

    // 캔버스 크기 설정
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      console.log('Canvas resized:', canvas.width, 'x', canvas.height);
      if (imageLoaded.current) {
        initLetters(); // 리사이즈 시 글자 재배치
      }
    };

    // 초기 글자 생성
    const initLetters = () => {
      if (!backgroundImage.current || !canvas) return;

      // 이미지 크기를 300x300으로 고정
      const renderWidth = 300;
      const renderHeight = 300;
      const offsetX = Math.floor((canvas.width - renderWidth) / 2);
      const offsetY = Math.floor((canvas.height - renderHeight) / 2);

      // 원형 배치를 위한 설정 - 이미지 중심과 정확히 일치하도록 수정
      const centerX = offsetX + renderWidth / 2;
      const centerY = offsetY + renderHeight / 2;
      const radius = 150;
      const text = '안녕하세요 HELLO FLOWING LETTERS after 2025 good job like this';
      const chars = text.split('');
      
      letters.current = [];
      
      // 여러 개의 동심원을 그리며 글자 배치
      const circleCount = 8;
      for (let i = 0; i < circleCount; i++) {
        const currentRadius = (radius * (i + 1)) / circleCount;
        const circumference = 2 * Math.PI * currentRadius;
        const letterCount = Math.floor(circumference / 35);
        
        for (let j = 0; j < letterCount; j++) {
          const angle = (j / letterCount) * 2 * Math.PI;
          const char = chars[Math.floor(Math.random() * chars.length)];
          
          letters.current.push({
            char,
            x: centerX + Math.cos(angle) * currentRadius,
            y: centerY + Math.sin(angle) * currentRadius,
            vx: 0,
            vy: 0,
            size: 40 + Math.random() * 20,
            opacity: 1
          });
        }
      }

      // 중앙에도 글자 추가
      for (let i = 0; i < 12; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 70;
        letters.current.push({
          char,
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          vx: 0,
          vy: 0,
          size: 45 + Math.random() * 25,
          opacity: 1
        });
      }

      console.log('Letters initialized:', letters.current.length);
    };

    // 커서 그리기 함수
    const drawCursor = () => {
      if (!ctx) return;
      
      ctx.beginPath();
      ctx.arc(mousePos.current.x, mousePos.current.y, 50, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(150, 150, 150, 0.5)';
      ctx.fill();
    };

    // 애니메이션 함수
    const animate = () => {
      if (!ctx || !canvas || !backgroundImage.current || !imageLoaded.current) {
        console.log('Waiting for image to load...');
        animationFrameId.current = requestAnimationFrame(animate);
        return;
      }

      // 캔버스 초기화
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 이미지 크기를 300x300으로 고정하고 정확한 중앙 정렬
      const renderWidth = 300;
      const renderHeight = 300;
      const offsetX = Math.floor((canvas.width - renderWidth) / 2);
      const offsetY = Math.floor((canvas.height - renderHeight) / 2);

      try {
        ctx.drawImage(
          backgroundImage.current,
          offsetX,
          offsetY,
          renderWidth,
          renderHeight
        );
      } catch (error) {
        console.error('Error drawing image:', error);
      }

      // 커서 그리기
      drawCursor();

      // 글자 그리기
      letters.current.forEach(letter => {
        // 마우스와의 상호작용
        const dx = mousePos.current.x - letter.x;
        const dy = mousePos.current.y - letter.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const angle = Math.atan2(dy, dx);
          const force = (100 - distance) / 100;
          letter.vx -= Math.cos(angle) * force * 2.5;
          letter.vy -= Math.sin(angle) * force * 2.5;
        }

        // 다음 위치 계산
        const nextX = letter.x + letter.vx;
        const nextY = letter.y + letter.vy;

        // 화면 경계 처리
        const margin = letter.size / 2;
        
        // 가로 방향 처리
        if (nextX < margin) {
          letter.x = margin;
          letter.vx = Math.abs(letter.vx) * 0.7; // 더 강한 감속
        } else if (nextX > canvas.width - margin) {
          letter.x = canvas.width - margin;
          letter.vx = -Math.abs(letter.vx) * 0.7;
        } else {
          letter.x = nextX;
        }
        
        // 세로 방향 처리
        if (nextY < margin) {
          letter.y = margin;
          letter.vy = Math.abs(letter.vy) * 0.7;
        } else if (nextY > canvas.height - margin) {
          letter.y = canvas.height - margin;
          letter.vy = -Math.abs(letter.vy) * 0.7;
        } else {
          letter.y = nextY;
        }

        // 감속
        letter.vx *= 0.98;
        letter.vy *= 0.98;

        // 글자 그리기
        ctx.font = `bold ${letter.size}px Arial`;
        ctx.fillStyle = `rgba(255, 255, 255, ${letter.opacity})`;
        ctx.fillText(letter.char, letter.x, letter.y);
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    // 마우스 이벤트 핸들러
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    // 초기화
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    animate();

    // 클린업
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ background: 'black', cursor: 'none' }}
    />
  );
};

export default FlowingLettersEffect; 