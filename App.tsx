import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Process from './components/Process';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Education from './components/Education';
import Contact from './components/Contact';
import CommandPalette from './components/CommandPalette';
import ScrollProgress from './components/ScrollProgress';

/**
 * "Deck of cards" scroll.
 *
 * From md up the hero is fixed; every following section is opaque and carries a higher
 * z-index than the one before it, so each slides up over its predecessor.
 * Section z-indexes live on the sections themselves (z-10, z-[15], z-20 … z-50)
 * — keep them in ascending document order when adding a section.
 */
const App: React.FC = () => (
  <div className="min-h-screen bg-neon-bg text-slate-200">
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-neon-cyan focus:px-5 focus:py-2.5 focus:font-mono focus:text-sm focus:font-bold focus:text-black"
    >
      Skip to content
    </a>

    <ScrollProgress />
    <Navbar />
    <CommandPalette />

    {/* tabIndex={-1} makes the skip link's target programmatically focusable. */}
    <main id="main" tabIndex={-1} className="relative w-full outline-none">
      <Hero />
      <Experience />
      <Process />
      <Skills />
      <Projects />
      <Education />
      <Contact />
    </main>
  </div>
);

export default App;
