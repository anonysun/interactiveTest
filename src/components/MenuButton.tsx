import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MenuButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { title: '홈', path: '/' },
    { title: '낙원계산기', path: '/nakwon' },
    { title: 'Terminate Text', path: '/terminate-text' },
    { title: 'Move Image', path: '/move-image' },
    { title: '3D Text', path: '/3d-text' },
    { title: 'BW to COLOR', path: '/bw-to-color' },
    { title: '2D Flow Effect', path: '/2d-flow' },
    { title: '3D Flow Effect', path: '/3d-flow' },
    { title: 'INTERACTIVE', path: '/interactive' },
    { title: 'Card Stack', path: '/card-stack' },
    { title: 'Motion Examples', path: '/motion-examples' },
    { title: 'Scribble', path: '/scribble' },
    { title: 'Particles', path: '/particles' },
    { title: 'Sections', path: '/sections' },
  ];

  return (
    <div className="fixed top-8 right-8 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transform transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
        >
          <path
            d="M4 6H20M4 12H20M4 18H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* 드롭다운 메뉴 */}
      <div
        className={`absolute top-16 right-0 bg-white rounded-lg shadow-xl py-2 w-48 transform transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MenuButton;
