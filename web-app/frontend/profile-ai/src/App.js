import React from 'react';
import Header from './components/Header';
import FeaturesSection from './components/FeaturesSection';
import PricingSection from './components/PricingSection';
import LandingSection from './components/LandingSection/LandingSection';
// import CommunitySection from './components/CommunitySection';
// import BlogSection from './components/BlogSection';
// import RoadmapSection from './components/RoadmapSection';
import './App.css';

function App() {
  return (
      <div className="App">
        <Header />
        <main>
            <LandingSection />
          <FeaturesSection />
          <PricingSection />
          {/*<CommunitySection />*/}
          {/*<BlogSection />*/}
          {/*<RoadmapSection />*/}
        </main>
      </div>
  );
}

export default App;
