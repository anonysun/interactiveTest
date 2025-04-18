import React from 'react';
import ScrollSection from './components/ScrollSection';
import './App.css';

function App() {
  return (
    <div className="min-h-screen">
      <ScrollSection 
        p1ImageUrl="/img/p1.png"
        p2ImageUrl="/img/p2.png"
      />
    </div>
  );
}

export default App;
