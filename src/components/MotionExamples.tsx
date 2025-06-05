import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionExamples: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  // 드래그 가능한 카드
  const DraggableCard = () => (
    <motion.div
      drag
      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
      dragElastic={0.2}
      whileDrag={{ scale: 1.1 }}
      animate={dragPosition}
onDragEnd={(_, info) => {
  setDragPosition(prev => ({
    x: prev.x + info.offset.x,
    y: prev.y + info.offset.y,
  }));
}}
      className="w-32 h-32 bg-blue-500 rounded-lg cursor-grab active:cursor-grabbing"
    />
  );

  // 호버 효과가 있는 버튼
  const HoverButton = () => (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="px-6 py-3 bg-purple-500 text-white rounded-full"
    >
      Hover Me!
    </motion.button>
  );

  // 스크롤 기반 애니메이션
  const ScrollAnimatedBox = () => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="w-full h-32 bg-green-500 rounded-lg"
    />
  );

  // 3D 플립 카드
  const FlipCard = () => (
    <motion.div
      className="w-64 h-96 bg-white rounded-xl shadow-xl"
      animate={{ rotateY: isOpen ? 180 : 0 }}
      transition={{ duration: 0.5 }}
      onClick={() => setIsOpen(!isOpen)}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="w-full h-full flex items-center justify-center"
        style={{ backfaceVisibility: 'hidden' }}
      >
        {!isOpen ? (
          <h2 className="text-2xl font-bold">Front</h2>
        ) : (
          <motion.h2
            className="text-2xl font-bold"
            style={{ transform: 'rotateY(180deg)' }}
          >
            Back
          </motion.h2>
        )}
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen p-8 space-y-12">
      <h1 className="text-3xl font-bold mb-8">Framer Motion Examples</h1>
      
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Draggable Card</h2>
        <DraggableCard />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Hover Button</h2>
        <HoverButton />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Scroll Animation</h2>
        <ScrollAnimatedBox />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">3D Flip Card</h2>
        <FlipCard />
      </section>

      {/* 모달 예시 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Modal Animation</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Toggle Modal
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            >
              <motion.div
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                exit={{ y: 50 }}
                className="bg-white p-8 rounded-lg"
              >
                <h3 className="text-xl font-bold mb-4">Animated Modal</h3>
                <p>This modal has smooth enter/exit animations!</p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default MotionExamples;
