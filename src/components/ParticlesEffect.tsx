import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

// 다양한 도형을 위한 custom shape preset (polygon, rounded-rect, cross 등)
// 일부는 기본 제공, 일부는 custom shape loader 필요

// 파티클 색상 팔레트: 다양한 회색 계열 + 강조 색상
const COLORS = [
  '#222', '#444', '#666', '#888', '#aaa', '#ccc', '#fff', // 다양한 회색/흰색
  '#304ffe', '#00e676', '#ff1744', '#ffd600' // 강조 색상 (파랑, 초록, 빨강, 노랑)
];

// 파티클 도형 종류: 기본 + 커스텀(rounded-rect, cross)
const SHAPES = [
  'circle', 'square', 'polygon', 'edge', 'triangle', 'star', 'rounded-rect', 'cross'
];

const ParticlesEffect: React.FC = () => {
  // tsparticles 엔진에 커스텀 도형(rounded-rect, cross) 및 중력 updater 등록
  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine);
    // 모서리가 둥근 사각형(알약 형태)
    engine.addShape('rounded-rect', (context: CanvasRenderingContext2D, particle: any, radius: number) => {
      context.beginPath();
      const r = Math.max(radius, 8);
      // 각 꼭짓점에 곡선을 넣어 부드럽게 만듦
      context.moveTo(-r, -r + 8);
      context.quadraticCurveTo(-r, -r, -r + 8, -r);
      context.lineTo(r - 8, -r);
      context.quadraticCurveTo(r, -r, r, -r + 8);
      context.lineTo(r, r - 8);
      context.quadraticCurveTo(r, r, r - 8, r);
      context.lineTo(-r + 8, r);
      context.quadraticCurveTo(-r, r, -r, r - 8);
      context.closePath();
      context.fill();
    });
    // 십자(+) 모양
    engine.addShape('cross', (context: CanvasRenderingContext2D, particle: any, radius: number) => {
      context.save();
      context.beginPath();
      // 십자 형태로 12개 점을 이어 그림
      context.moveTo(-radius, -4);
      context.lineTo(-4, -4);
      context.lineTo(-4, -radius);
      context.lineTo(4, -radius);
      context.lineTo(4, -4);
      context.lineTo(radius, -4);
      context.lineTo(radius, 4);
      context.lineTo(4, 4);
      context.lineTo(4, radius);
      context.lineTo(-4, radius);
      context.lineTo(-4, 4);
      context.lineTo(-radius, 4);
      context.closePath();
      context.fill();
      context.restore();
    });
    // 중력 + 하단 제한 커스텀 updater 등록
    engine.addParticleUpdater('gravity', (container: any) => {
      return {
        // 파티클 생성 시 아래쪽 반에만 위치하도록 초기화
        init: (particle: any) => {
          const canvas = container.canvas.size;
          if (particle.position) {
            particle.position.y = canvas.height * (0.5 + 0.5 * Math.random());
          }
          // vy(세로 속도) 초기화
          if (!particle.velocity) return;
          particle.velocity.vertical = 0;
        },
        isEnabled: () => true,
        update: (particle: any, delta: any) => {
          const canvas = container.canvas.size;
          // 중력 가속도 적용
          const gravity = 0.03 * (delta.factor || 1); // 중력 가속도
          if (!particle.velocity) return;
          particle.velocity.vertical += gravity;

          // 파티클 위치 업데이트
          particle.position.y += particle.velocity.vertical;

          // 바닥에 닿으면 튕김(감쇠)
          if (particle.position.y + particle.getRadius() > canvas.height) {
            particle.position.y = canvas.height - particle.getRadius();
            particle.velocity.vertical *= -0.6; // 튕김 감쇠
            // 너무 느리면 멈춤
            if (Math.abs(particle.velocity.vertical) < 0.2) {
              particle.velocity.vertical = 0;
            }
          }
        },
        beforeDraw: () => {},
        afterDraw: () => {},
        reset: () => {},
      };
    });
  }, []);

  // 파티클 옵션 상세 주석 포함
  const options = {
    fullScreen: { enable: false }, // 전체화면 비활성화(컨테이너 내에서만)
    background: { color: 'transparent' }, // 배경 투명
    fpsLimit: 60, // 최대 프레임 제한
    particles: {
      number: {
        value: 90, // 파티클 개수
        density: { enable: true, area: 900 } // 영역당 밀도(고르게 분포)
      },
      color: { value: COLORS }, // 색상 팔레트 적용
      shape: {
        type: SHAPES, // 다양한 도형 사용
        options: {
          polygon: { sides: 5 }, // 5각형
          star: { sides: 6 },    // 6각형
        }
      },
      opacity: {
        value: 0.85, // 기본 투명도
        random: { enable: true, minimumValue: 0.5 } // 파티클별로 랜덤 투명도
      },
      size: {
        value: { min: 8, max: 18 }, // 파티클 크기 범위
        random: true // 랜덤 크기
      },
      move: {
        enable: true, // 움직임 활성화
        speed: 0.7, // 기본 이동 속도(느리고 유기적)
        direction: 'none' as any, // 특정 방향 없이 자유롭게
        random: true, // 각 파티클별로 방향/속도 랜덤
        straight: false, // 직선 이동 비활성화(자연스러운 곡선)
        outModes: { default: 'bounce' as any }, // 경계에서 튕김
        attract: { // 파티클 간 약한 끌어당김 효과
          enable: true,
          rotateX: 600, // X축 회전(끌림 강도)
          rotateY: 1200 // Y축 회전(끌림 강도)
        },
        trail: { enable: false } // 잔상 효과 비활성화
      },
      collisions: { enable: true }, // 파티클끼리 충돌 시 튕김(겹침 방지)
      links: { enable: false }, // 파티클 간 선 연결 비활성화
      zIndex: { value: 0 }, // z-index 고정
    },
    interactivity: {
      detect_on: 'canvas' as any, // 마우스 이벤트 감지 위치(캔버스)
      events: {
        onhover: {
          enable: true, // 마우스 hover 시 상호작용 활성화
          mode: 'repulse', // repulse: 마우스 근처 파티클 밀어내기
          parallax: { enable: false } // 시차 효과 비활성화
        },
        resize: true // 창 크기 변경 시 자동 리사이즈
      },
      modes: {
        // 마우스 repulse(밀어내기) 효과 세부 설정
        repulse: {
          distance: 120, // 마우스 반응 반경(px)
          duration: 0.6, // 밀려난 후 복귀까지 걸리는 시간(초)
          factor: 120, // 밀어내기 강도
          speed: 0.7, // 밀려나는 속도
          easing: 'easeOutQuad' // 부드러운 가속도 곡선
        },
        // attract(끌어당김) 모드(기본은 move에서 사용)
        attract: {
          distance: 200, // 끌림 반경
          duration: 0.4, // 끌림 지속 시간
          factor: 2 // 끌림 강도
        }
      }
    },
    detectRetina: true, // Retina 디스플레이 지원
    pauseOnBlur: false, // 창 비활성화 시 일시정지 비활성화
    style: { position: 'absolute', inset: '0', width: '100%', height: '100%' } // 스타일(컨테이너 꽉 채움)
  };

  return (
    <div className="absolute inset-0 w-full h-full">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={options}
        style={{ position: 'absolute', inset: '0', width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default ParticlesEffect;
export {}; 