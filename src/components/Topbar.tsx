import React from 'react';
import { Bell, User } from 'lucide-react';

const Topbar: React.FC = () => {
  return (
    <header className="flex items-center justify-between bg-white rounded-2xl shadow px-8 py-4 mt-6 mx-8 mb-8">
      {/* 검색창 */}
      <div className="flex items-center w-1/3">
        <input
          type="text"
          placeholder="Search ..."
          className="w-full px-4 py-2 rounded-lg bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
        />
      </div>
      {/* 우측 아이콘 */}
      <div className="flex items-center gap-6">
        <button className="text-gray-400 hover:text-violet-500 transition-colors">
          <Bell size={22} />
        </button>
        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          <User size={22} className="text-gray-500" />
        </div>
      </div>
    </header>
  );
};

export default Topbar; 