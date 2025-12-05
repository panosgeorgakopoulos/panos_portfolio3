import React, { useState, useEffect, useRef } from 'react';
import { PROJECTS } from '../constants';
import { ArrowUpRight } from 'lucide-react';

const Projects: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="projects" 
      ref={sectionRef}
      className="relative min-h-screen bg-neon-bg border-t border-white/10 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col justify-center py-20 z-30"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"></div>

      <div className={`max-w-7xl mx-auto px-6 w-full relative z-10 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
               <span className="text-neon-cyan font-mono text-xs tracking-widest">03 / PORTFOLIO</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white">
              SELECTED WORK
            </h2>
          </div>
          <span className="hidden md:block font-mono text-neon-cyan">01 — 0{PROJECTS.length}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project) => (
            <div 
              key={project.id} 
              className="group relative bg-black border border-white/10 hover:border-neon-purple transition-all duration-500 overflow-hidden flex flex-col h-full hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(189,0,255,0.2)]"
            >
              
              {/* Image Container with Scan Effect */}
              <a 
                href={project.link || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-64 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-500 block cursor-pointer"
              >
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-neon-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 left-0 w-full h-[2px] bg-neon-cyan opacity-0 group-hover:opacity-100 animate-scan"></div>
              </a>

              {/* Content */}
              <div className="p-8 relative flex-1 flex flex-col">
                <a 
                  href={project.link || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute -top-6 right-8 w-12 h-12 bg-black border border-white/10 flex items-center justify-center rounded-full group-hover:bg-neon-cyan group-hover:border-neon-cyan transition-all duration-300 z-20 hover:scale-110 cursor-pointer shadow-lg"
                >
                   <ArrowUpRight size={20} className="text-white group-hover:text-black group-hover:rotate-45 transition-all duration-300 group-hover:animate-pulse" />
                </a>

                <a 
                  href={project.link || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <h3 className="text-2xl font-display font-medium text-white mb-3 group-hover:text-neon-cyan transition-colors cursor-pointer">
                    {project.title}
                  </h3>
                </a>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">
                  {project.description}
                </p>
                
                <div className="mt-auto flex flex-wrap gap-2 pt-4 border-t border-white/5">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-mono text-slate-500">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;