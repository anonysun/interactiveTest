import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Calculator, Image, Type, Layers, Zap, Grid, PenTool, Circle, Settings, User } from 'lucide-react';

const menu = [
  { label: 'Dashboard', path: '/dashboard', icon: <Home size={22} /> },
  { label: '낙원계산기', path: '/nakwon', icon: <Calculator size={22} /> },
  { label: 'Terminate', path: '/terminate-text', icon: <Type size={22} /> },
  { label: 'Move Image', path: '/move-image', icon: <Image size={22} /> },
  { label: '3D Text', path: '/3d-text', icon: <Layers size={22} /> },
  { label: 'BW to Color', path: '/bw-to-color', icon: <Zap size={22} /> },
  { label: '2D Flow', path: '/2d-flow', icon: <Grid size={22} /> },
  { label: '3D Flow', path: '/3d-flow', icon: <Circle size={22} /> },
  { label: 'Scribble', path: '/scribble', icon: <PenTool size={22} /> },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="relative z-30 flex flex-col items-center bg-black text-white w-20 py-6 min-h-screen">
      {/* 상단 둥근 컷 */}
      <div className="absolute -left-8 top-0 w-16 h-16 bg-gray-50 rounded-br-3xl" style={{zIndex:1}} />
      {/* 로고 */}
      <div className="mb-10 z-10">
        <motion.div whileTap={{ scale: 0.9 }}>
          <span className="text-3xl font-bold text-violet-400">Q</span>
        </motion.div>
      </div>
      {/* 메뉴 */}
      <nav className="flex flex-col gap-3 w-full z-10">
        {menu.map((item, idx) => {
          const selected = location.pathname === item.path;
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`group flex flex-col items-center w-16 mx-auto py-3 transition-all duration-200 ${selected ? 'bg-white text-black rounded-l-3xl shadow-lg' : 'hover:bg-gray-800'}`}
              whileTap={{ scale: 1.15 }}
              animate={selected ? { scale: 1.1, y: -2 } : { scale: 1, y: 0 }}
              transition={{ type: 'spring', bounce: 0.4, damping: 10 }}
            >
              <span className="mb-1">{item.icon}</span>
              <span className={`text-xs font-semibold ${selected ? 'text-black' : 'text-white'} transition-colors`}>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>
      {/* 하단 여백/설정 등 */}
      <div className="flex-1" />
      <motion.button whileTap={{ scale: 1.1 }} className="mb-4 text-gray-400 hover:text-violet-400">
        <Settings size={22} />
      </motion.button>
      <motion.button whileTap={{ scale: 1.1 }} className="mb-2">
        <User size={22} />
      </motion.button>
    </aside>
  );
};

export default Sidebar; 