import React from 'react';
import { Link } from 'react-router-dom';
import ThreeDTextEffect from '../components/ThreeDTextEffect';

const ThreeDText: React.FC = () => {
  return (
    <div className="w-full h-screen overflow-hidden bg-black relative">
      <Link 
        to="/" 
        className="absolute top-8 left-8 text-gray-200 hover:text-white transition-colors z-20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </Link>
      <ThreeDTextEffect />
    </div>
  );
};

export default ThreeDText; 