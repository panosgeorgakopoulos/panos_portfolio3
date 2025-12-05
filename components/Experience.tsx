import React, { useState, useEffect, useRef } from 'react';
import { EXPERIENCES } from '../constants';

const Experience: React.FC = () => {
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
      id="experience" 
      ref={sectionRef}
      className="relative min-h-screen bg-neon-bg border-t border-white/10 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col justify-center py-20 z-10"
    >
      <div className={`max-w-5xl mx-auto px-6 w-full h-full flex flex-col justify-center ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
             <span className="text-neon-cyan font-mono text-xs tracking-widest">01 / CAREER</span>
             <div className="h-[1px] flex-1 bg-white/10"></div>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white">
            EXPERIENCE
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12">
           {/* Navigation/Timeline (Visual only) */}
           <div className="hidden md:flex flex-col gap-4 border-l border-white/5 pl-6 py-2">
              {EXPERIENCES.map((exp) => (
                 <div key={exp.id} className="text-sm font-mono text-slate-500 py-2">
                    {exp.period}
                 </div>
              ))}
           </div>

           {/* Content */}
           <div className="space-y-16">
              {EXPERIENCES.map((exp) => (
                <div key={exp.id} className="group relative">
                  <div className="absolute -left-3 md:-left-[3.25rem] top-2 w-2 h-2 rounded-full bg-neon-purple group-hover:shadow-[0_0_10px_#bd00ff] transition-shadow"></div>
                  
                  <h3 className="text-2xl font-display font-medium text-white mb-1 group-hover:text-neon-cyan transition-colors">
                    {exp.role}
                  </h3>
                  <h4 className="text-lg text-slate-400 mb-4 font-light">{exp.company}</h4>
                  
                  <p className="text-slate-400 leading-relaxed mb-6 font-light text-sm md:text-base border-l-2 border-white/5 pl-4 group-hover:border-neon-cyan/30 transition-colors">
                    {exp.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {exp.techStack.map(tech => (
                      <span key={tech} className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 bg-white/5 rounded text-slate-300 border border-white/5 group-hover:border-neon-purple/30 transition-colors">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;