import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';

const App: React.FC = () => {
  return (
    <div className="bg-neon-bg min-h-screen text-slate-200 selection:bg-neon-purple/30 selection:text-white">
      <Navbar />
      
      <main className="relative w-full">
        {/* 
           Stacking Context Strategy:
           Each section is sticky.
           Each subsequent section has a higher z-index and a solid background to cover the previous one.
           This creates the "Deck of Cards" scrolling effect.
        */}
        
        <div className="relative z-0">
          <Hero />
        </div>
        
        <div className="relative z-10">
          <Experience />
        </div>
        
        <div className="relative z-20">
          <Skills />
        </div>
        
        <div className="relative z-30">
          <Projects />
        </div>
        
        <div className="relative z-40">
          <Contact />
        </div>
      </main>
    </div>
  );
};

export default App;