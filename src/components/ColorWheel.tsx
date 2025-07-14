import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X } from 'lucide-react';

interface ColorWheelProps {
  isOpen: boolean;
  onClose: () => void;
  onColorChange: (color: string) => void;
  currentColor: string;
}

const ColorWheel: React.FC<ColorWheelProps> = ({ isOpen, onClose, onColorChange, currentColor }) => {
  const [selectedColor, setSelectedColor] = useState(currentColor);
  const wheelRef = useRef<HTMLDivElement>(null);

  // 미리 정의된 색상 팔레트 (블루/스카이/퍼플 계열 20가지)
  const colorPalette = [
    '#458cd9', // 밝은 블루
    '#1e90ff', // 선명한 블루
    '#60a5fa', // 연한 블루
    '#2563eb', // 진한 블루
    '#3b82f6', // 기본 블루
    '#0ea5e9', // 스카이
    '#38bdf8', // 밝은 스카이
    '#0284c7', // 진한 스카이
    '#0369a1', // 더 진한 스카이
    '#0c4a6e', // 아주 진한 스카이
    '#6366f1', // 인디고
    '#818cf8', // 연보라
    '#a5b4fc', // 더 연한 보라
    '#7dd3fc', // 연한 하늘
    '#bae6fd', // 아주 연한 하늘
    '#312e81', // 아주 진한 인디고
    '#3730a3', // 진한 인디고
    '#4f46e5', // 중간 인디고
    '#64748b', // 블루그레이
    '#94a3b8', // 연한 블루그레이
  ];

  useEffect(() => {
    setSelectedColor(currentColor);
  }, [currentColor]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    onColorChange(color);
  };

  const handleWheelClick = (e: React.MouseEvent) => {
    if (wheelRef.current && !wheelRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleWheelClick}
        >
          <motion.div
            ref={wheelRef}
            className="bg-white rounded-2xl shadow-2xl p-6 w-80 max-w-[90vw]"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Palette size={20} className="text-gray-600" />
                <h3 className="font-semibold text-gray-900">강조색 변경</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {/* 현재 선택된 색상 표시 */}
            <div className="mb-6">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: selectedColor }}
                />
                <div>
                  <p className="text-sm font-medium text-gray-700">현재 색상</p>
                  <p className="text-xs text-gray-500 font-mono">{selectedColor}</p>
                </div>
              </div>
            </div>

            {/* 컬러 팔레트 */}
            <div className="grid grid-cols-4 gap-3">
              {colorPalette.map((color, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleColorSelect(color)}
                  className={`w-12 h-12 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                    selectedColor === color 
                      ? 'border-gray-800 shadow-lg' 
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
            </div>

            {/* 커스텀 색상 입력 */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                커스텀 색상
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => handleColorSelect(e.target.value)}
                  className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedColor}
                  onChange={(e) => handleColorSelect(e.target.value)}
                  placeholder="#000000"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 적용 버튼 */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-white rounded-lg transition-colors"
                style={{ backgroundColor: selectedColor }}
              >
                적용
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ColorWheel; 