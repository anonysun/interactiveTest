import React from 'react';
import { Link } from 'react-router-dom';
import TerminateText from './TerminateText';

const TerminateTextDemo: React.FC = () => {
  const textData = [
    ['2178-04-21', '2190-07-16', 'X7', '2205-12-08'],
    ['2234-02-11', '2241-09-25', 'A5', '2253-01-30'],
    ['2301-06-17', '2312-03-05', 'B9', '2320-08-14'],
    ['2404-11-19', '2415-07-22', 'L0', '2428-05-29'],
  ];

  return (
    <div className="w-full min-h-screen bg-black p-8 flex flex-col items-center text-white relative">
      <Link 
        to="/" 
        className="absolute top-8 left-8 text-gray-300 hover:text-white transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </Link>
      <h1 className="text-6xl font-bold mb-16 text-gray-300">
        Event Codes
      </h1>
      <div className="w-full max-w-3xl">
        <table className="w-full border-separate" style={{ borderSpacing: '2rem 1rem' }}>
          <tbody>
            {textData.map((row, rowIndex) => (
              <tr key={rowIndex} className="text-left">
                {row.map((item, colIndex) => (
                  <td key={colIndex} className="align-top w-32 h-8 relative">
                    <div className="absolute">
                      <TerminateText text={item} className="text-lg font-mono" />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TerminateTextDemo; 