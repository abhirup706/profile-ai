import React from 'react';
import Header from './components/Header';
import FeaturesSection from './components/FeaturesSection';
import PricingSection from './components/PricingSection';
import LandingSection from './components/LandingSection/LandingSection';
import TryItOut from './components/TryItOut/TryItOut';
import Register from './components/Register/Register';
// import CommunitySection from './components/CommunitySection';
// import BlogSection from './components/BlogSection';
// import RoadmapSection from './components/RoadmapSection';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';

function App() {
  return (
      <Router>
      <div className="App">
        <Header />
        <main>
          {/*<CommunitySection />*/}
          {/*<BlogSection />*/}
          {/*<RoadmapSection />*/}
            <Routes>
            <Route path="/try-it-out" element={<TryItOut />} />
                <Route path="/register" element={<Register />} />

            {/* Default case for rendering the home page with sections */}
            <Route path="/" element={
                <>
                    <LandingSection />
                    <FeaturesSection />
                    <PricingSection />
                </>
            }/>
            </Routes>
        </main>
      </div>
      </Router>
  );
}

export default App;
