import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LatentField from './components/LatentField';
import PassRail from './components/PassRail';
import ProjectSection from './components/ProjectSection';
import MoreWork from './components/MoreWork';
import RecordSection from './components/RecordSection';
import Contact from './components/Contact';
import BackToTop from './components/BackToTop';
import { PROJECTS } from './constants';

const App: React.FC = () => (
  <>
    <a href="#work" className="skip">Skip to projects</a>
    <LatentField />
    <Navbar />
    <Hero />
    <PassRail />
    <main id="work">
      {PROJECTS.map((p, i) => <ProjectSection key={p.slug} project={p} index={i} />)}
      <MoreWork />
      <RecordSection />
    </main>
    <Contact />
    <BackToTop />
  </>
);

export default App;
