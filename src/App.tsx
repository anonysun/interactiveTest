import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TossSection from './components/TossSection';
import ServiceSection from './components/ServiceSection';
import FeatureSection from './components/FeatureSection';
import WheelSection from './components/WheelSection';
import ExpandSection from './components/ExpandSection';
import MoveImage from './pages/MoveImage';
import TerminateTextDemo from './pages/TerminateTextDemo';
import ThreeDText from './pages/ThreeDText';
import BWtoColor from './pages/BWtoColor';
import FlowingLettersEffect from './components/FlowingLettersEffect';
import ThreeDFlowingLettersEffect from './components/3DFlowingLettersEffect';
import InteractivePage from './components/InteractivePage';
import Shadow from './pages/Shadow';
import CardStackContainer from './components/CardStackContainer';
import MotionExamples from './components/MotionExamples';
import Scribble from './pages/Scribble';
import Particles from './pages/Particles';
import NakwonCalculator from './pages/NakwonCalculator';
import Sections from './pages/Sections';
import Dashboard from './pages/Dashboard';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="w-full min-h-screen">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/nakwon" element={<NakwonCalculator />} />
          <Route path="/terminate-text" element={<TerminateTextDemo />} />
          <Route path="/move-image" element={<MoveImage />} />
          <Route path="/3d-text" element={<ThreeDText />} />
          <Route path="/bw-to-color" element={<BWtoColor />} />
          <Route path="/2d-flow" element={<FlowingLettersEffect />} />
          <Route path="/3d-flow" element={<ThreeDFlowingLettersEffect />} />
          <Route path="/interactive" element={<InteractivePage />} />
          <Route path="/shadow" element={<Shadow />} />
          <Route path="/card-stack" element={<CardStackContainer />} />
          <Route path="/motion-examples" element={<MotionExamples />} />
          <Route path="/scribble" element={<Scribble />} />
          <Route path="/particles" element={<Particles />} />
          <Route path="/sections" element={<Sections />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
