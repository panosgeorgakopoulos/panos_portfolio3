import React, { useState, useEffect, useRef } from 'react';
import { Mail, Linkedin, Github, Twitter } from 'lucide-react';
import { RESUME_DATA } from '../constants';

const Contact: React.FC = () => {
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
      id="contact" 
      ref={sectionRef}
      className="relative min-h-screen bg-black flex items-center justify-center border-t border-white/10 shadow-[0_-20px_60px_-15px_rgba(0,0,0,1)] py-20 z-40"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"></div>
      
      {/* Radial Glow */}
      <div className="absolute inset-0 bg-radial-gradient from-neon-purple/10 to-transparent opacity-50 pointer-events-none"></div>

      <div className={`max-w-4xl mx-auto px-6 text-center relative z-10 w-full ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <div className="inline-block mb-6 px-4 py-1 border border-neon-cyan/30 rounded-full bg-neon-cyan/5 text-neon-cyan font-mono text-sm tracking-widest animate-pulse">
           SYSTEM STATUS: ONLINE
        </div>
        
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-10 tracking-tight">
          READY TO <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">COLLABORATE?</span>
        </h2>
        
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light">
          Available for freelance projects, full-time roles, or just a chat about the future of AI.
        </p>
        
        <div className="flex justify-center gap-6 md:gap-10 mb-20">
          <a href={`mailto:${RESUME_DATA.email}`} className="group p-5 rounded-full border border-white/10 hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]">
            <Mail size={32} strokeWidth={1.5} className="text-slate-400 group-hover:text-neon-cyan transition-colors" />
          </a>
          <a href={`https://${RESUME_DATA.socials.linkedin}`} target="_blank" rel="noreferrer" className="group p-5 rounded-full border border-white/10 hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]">
            <Linkedin size={32} strokeWidth={1.5} className="text-slate-400 group-hover:text-neon-cyan transition-colors" />
          </a>
          <a href={`https://${RESUME_DATA.socials.github}`} target="_blank" rel="noreferrer" className="group p-5 rounded-full border border-white/10 hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]">
            <Github size={32} strokeWidth={1.5} className="text-slate-400 group-hover:text-neon-cyan transition-colors" />
          </a>
          <a href={`https://${RESUME_DATA.socials.twitter}`} target="_blank" rel="noreferrer" className="group p-5 rounded-full border border-white/10 hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]">
            <Twitter size={32} strokeWidth={1.5} className="text-slate-400 group-hover:text-neon-cyan transition-colors" />
          </a>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-slate-600 gap-4">
          <span>© {new Date().getFullYear()} Panos Georgakopoulos</span>
          <span>DESIGNED & ENGINEERED IN GREECE</span>
        </div>
      </div>
    </section>
  );
};

export default Contact;