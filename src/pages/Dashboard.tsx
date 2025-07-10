import React, { useState } from 'react';
import Topbar from '../components/Topbar';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart2, Users, DollarSign, Settings, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const dashboardMenu = [
  { label: 'Analytics', icon: <BarChart2 size={22} /> },
  { label: 'Users', icon: <Users size={22} /> },
  { label: 'Revenue', icon: <DollarSign size={22} /> },
  { label: 'Settings', icon: <Settings size={22} /> },
];

const allPages = [
  { label: 'Home', path: '/' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Nakwon Calculator', path: '/nakwon' },
  { label: 'Terminate Text', path: '/terminate-text' },
  { label: 'Move Image', path: '/move-image' },
  { label: '3D Text', path: '/3d-text' },
  { label: 'BW to Color', path: '/bw-to-color' },
  { label: '2D Flow', path: '/2d-flow' },
  { label: '3D Flow', path: '/3d-flow' },
  { label: 'Interactive', path: '/interactive' },
  { label: 'Card Stack', path: '/card-stack' },
  { label: 'Motion Examples', path: '/motion-examples' },
  { label: 'Scribble', path: '/scribble' },
  { label: 'Particles', path: '/particles' },
  { label: 'Sections', path: '/sections' },
];

const menuAnimate = (isSelected: boolean) => isSelected ? { scale: 1.1, y: -2 } : { scale: 1, y: 0 };
const menuTransition = { type: 'tween' as const, duration: 0.15 };
const svgTransition = { type: 'tween' as const, duration: 0.1 };

const Dashboard: React.FC = () => {
  const [selected, setSelected] = useState('Analytics');
  const [showAllMenu, setShowAllMenu] = useState(false);
  const navigate = useNavigate();

  const handleMenuClick = (path: string) => {
    navigate(path);
    setShowAllMenu(false);
  };

  const handleDashboardMenuClick = (label: string) => {
    setSelected(label);
    setShowAllMenu(false);
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* 데스크탑: 사이드바 */}
      <aside className="relative z-30 flex-col items-center bg-black text-white w-20 py-6 min-h-screen hidden md:flex">
        {/* 대시보드 로고 */}
        <div className="mb-10 z-10">
          <motion.div whileTap={{ scale: 0.9 }}>
            <span className="text-3xl font-bold text-violet-400">Q</span>
          </motion.div>
        </div>
        {/* 메뉴 영역: flex로 쌓기 */}
        <nav className="flex flex-col gap-3 w-full z-10">
          {dashboardMenu.map((item) => {
            const isSelected = selected === item.label;
            return (
              <div className="relative w-full" key={item.label}>
                <motion.button
                  onClick={() => setSelected(item.label)}
                  className={`group flex flex-col items-center py-3 transition-all duration-200 relative
                    ${isSelected ? 'bg-white text-black rounded-l-3xl z-20 ml-2 w-[calc(100%-0.5rem)]' : 'text-white w-full'}
                  `}
                 // style={isSelected ? { boxShadow: '2px 0 8px 0 rgba(0,0,0,0.04)' } : {}}
                  whileTap={{ scale: 1.15 }}
                  animate={menuAnimate(isSelected)}
                  transition={menuTransition}
                >
                  <span className="mb-1">{item.icon}</span>
                  <span className={`text-xs font-semibold ${isSelected ? 'text-black' : 'text-white'} transition-colors`}>{item.label}</span>
                  <AnimatePresence>
                    {isSelected && (
                      <>
                        {/* 아래쪽 곡선 */}
                        <motion.svg
                          className="absolute -right-1 -bottom-3 w-4 h-4 z-30 pointer-events-none origin-bottom-right"
                          viewBox="0 0 10 10"
                          fill="#fff"
                          xmlns="http://www.w3.org/2000/svg"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={svgTransition}
                        >
                          <path d="M2,2 Q8,2 8,8" stroke="white" strokeWidth="2" fill="#fff" />
                        </motion.svg>
                        {/* 위쪽 곡선 */}
                        <motion.svg
                          className="absolute -right-1 -top-3 w-4 h-4 z-30 pointer-events-none origin-top-right"
                          viewBox="0 0 10 10"
                          fill="#fff"
                          xmlns="http://www.w3.org/2000/svg"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={svgTransition}
                        >
                          <path d="M2,8 Q8,8 8,3" stroke="white" strokeWidth="2" fill="#fff" />
                        </motion.svg>
                      </>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            );
          })}
        </nav>
        {/* 하단: 햄버거(전체 메뉴) 버튼만 남김 */}
        <div className="flex-1" />
        <div className="w-full border-t border-gray-800 pt-4 flex flex-col items-center gap-2 pb-2">
          <button
            onClick={() => setShowAllMenu(true)}
            className="flex flex-col items-center text-gray-400 md:hover:text-violet-400 transition-colors py-2 mt-2"
            aria-label="전체 페이지"
          >
            <Menu size={22} />
            <span className="text-xs mt-1">전체 페이지</span>
          </button>
        </div>
      </aside>
      {/* 모바일: 상단바에 햄버거 버튼 */}
      <div className="md:hidden fixed top-0 left-0 w-full z-40 flex items-center justify-between bg-white px-4 py-3 shadow">
        <span className="text-2xl font-bold text-violet-400">Q</span>
        <button
          onClick={() => setShowAllMenu(true)}
          className="flex items-center text-gray-700 md:hover:text-violet-500 transition-colors"
          aria-label="전체 페이지"
        >
          <Menu size={28} />
        </button>
      </div>
      {/* 메인 영역: 모바일은 상단바 높이만큼 pt-14 */}
      <div className="flex-1 flex flex-col bg-white z-10 pt-0 md:pt-0" style={{ paddingTop: '56px' }}>
        <div className="hidden md:block">
          <Topbar />
        </div>
        {/* 대시보드 콘텐츠 틀 (선택된 메뉴에 따라 내용만 다르게 보이게) */}
        <main className="flex-1 p-4 md:p-8 grid grid-cols-12 gap-6">
          <section className="col-span-12 md:col-span-8 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-black text-white rounded-2xl p-6 flex flex-col justify-between min-h-[120px]" />
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow min-h-[120px]" />
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow min-h-[120px]" />
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow min-h-[120px]" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-8 min-h-[300px] flex items-center justify-center text-2xl font-bold text-gray-400">
              {selected} Content (가짜 내용)
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-black text-white rounded-2xl p-6 shadow min-h-[100px]" />
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow min-h-[100px]" />
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow min-h-[100px]" />
            </div>
          </section>
          <aside className="col-span-12 md:col-span-4 flex flex-col gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow min-h-[260px]" />
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow min-h-[180px]" />
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow min-h-[120px]" />
          </aside>
        </main>
      </div>
      {/* 전체 메뉴 오버레이: 데스크탑/모바일 공통, 모바일은 drawer */}
      <AnimatePresence>
        {showAllMenu && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-50 flex md:items-center md:justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAllMenu(false)}
          >
            {/* 모바일: 왼쪽에서 슬라이드 인 drawer */}
            <motion.div
              className="bg-black rounded-r-2xl shadow-xl p-6 w-64 max-w-[90vw] h-full flex flex-col gap-3 fixed left-0 top-0 bottom-0 md:static md:bg-white md:rounded-2xl md:w-80 md:max-h-[80vh] md:overflow-y-auto md:p-8"
              initial={{ x: '-100%', opacity: 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'tween', duration: 0.22 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg text-white md:text-gray-900">전체 페이지</span>
                <button onClick={() => setShowAllMenu(false)} className="text-gray-400 md:hover:text-violet-400">
                  ×
                </button>
              </div>
              {/* 대시보드 가짜 메뉴 (모바일 drawer에서만) */}
              <div className="block md:hidden border-b border-gray-700 pb-2 mb-2">
                {dashboardMenu.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleDashboardMenuClick(item.label)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg w-full transition-colors
                      ${selected === item.label ? 'bg-white text-black font-bold' : 'text-white'}
                      md:hover:bg-violet-50 md:hover:text-violet-600`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
              {/* 전체 페이지 메뉴 */}
              {allPages.map((item) => {
                const isCurrent = window.location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleMenuClick(item.path)}
                    className={`text-left px-3 py-2 rounded-lg w-full transition-colors
                      ${isCurrent ? 'bg-white text-black font-bold' : 'text-white'}
                      md:text-gray-700 md:hover:bg-violet-50 md:hover:text-violet-600`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard; 