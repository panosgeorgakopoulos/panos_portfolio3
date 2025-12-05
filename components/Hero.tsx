import React, { useState, useRef, useEffect } from 'react';
import { RESUME_DATA } from '../constants';

const CHARS = "-_~`!@#$%^&*()+=[]{}|;:,.<>?/0123456789";

const DecryptedText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const [displayText, setDisplayText] = useState(text);
  
  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(prev => 
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, 40);

    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{displayText}</span>;
};

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  color: string;
}

const Hero: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const generatedParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1,
      speed: (Math.random() - 0.5) * 40,
      color: Math.random() > 0.6 ? '#00f0ff' : (Math.random() > 0.3 ? '#bd00ff' : '#ffffff')
    }));
    setParticles(generatedParticles);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const { left, top, width, height } = sectionRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 2 - 1;
    const y = ((e.clientY - top) / height) * 2 - 1;
    setMousePos({ x, y });
  };

  const bgMoveX = mousePos.x * -20;
  const bgMoveY = mousePos.y * -20;
  const coreRotateY = mousePos.x * 20; 
  const coreRotateX = mousePos.y * -20; 

  return (
    <>
      <section 
        ref={sectionRef}
        id="hero" 
        onMouseMove={handleMouseMove}
        className="fixed top-0 left-0 w-full h-screen flex items-center justify-center overflow-hidden bg-neon-bg z-0"
      >
        {/* Grid Background */}
        <div className="absolute inset-0 bg-grid-pattern bg-[size:50px_50px] opacity-20"
             style={{ transform: `translate(${bgMoveX * 0.5}px, ${bgMoveY * 0.5}px)` }}></div>
        
        {/* Ambience */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-neon-cyan/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full transition-transform duration-700 ease-out"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                opacity: p.opacity,
                boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                transform: `translate(${mousePos.x * p.speed}px, ${mousePos.y * p.speed}px)`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[65%_35%] gap-8 items-center h-full">
          
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in-up relative z-20">
            <div className="flex items-center gap-3">
               <div className="h-[1px] w-12 bg-neon-cyan shadow-[0_0_10px_#00f0ff]"></div>
               <span className="text-neon-cyan font-mono text-xs tracking-[0.2em] uppercase">System Online</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl 2xl:text-8xl font-display font-light leading-[0.9] tracking-tighter">
              <span className="block text-white opacity-90">I AM</span>
              <DecryptedText 
                text={RESUME_DATA.name.toUpperCase()} 
                className="block font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple text-glow"
              />
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 font-light max-w-xl border-l-2 border-white/10 pl-6 leading-relaxed">
              {RESUME_DATA.title} <br/>
              <span className="text-sm font-mono text-neon-purple mt-2 block opacity-80">{RESUME_DATA.location}</span>
            </p>
          </div>

          {/* 3D Cube / Visual */}
          <div className="relative h-[400px] md:h-[600px] w-full hidden lg:flex items-center justify-center perspective-container pointer-events-none z-10">
             <div 
                className="relative w-48 h-48 md:w-64 md:h-64 transition-transform duration-100 ease-linear"
                style={{
                  transform: `rotateX(${coreRotateX}deg) rotateY(${coreRotateY}deg)`,
                  transformStyle: 'preserve-3d'
                }}
             >
                {/* Inner Core */}
                <div className="absolute inset-10 bg-neon-cyan/20 rounded-full blur-xl animate-pulse" style={{ transform: 'translateZ(0)' }}></div>

                {/* Cube Faces Construction */}
                {[
                  { rotate: 'rotateY(0deg)', trans: '128px', border: 'neon-cyan' },
                  { rotate: 'rotateY(180deg)', trans: '128px', border: 'neon-purple' },
                  { rotate: 'rotateY(90deg)', trans: '128px', border: 'white' },
                  { rotate: 'rotateY(-90deg)', trans: '128px', border: 'white' },
                  { rotate: 'rotateX(90deg)', trans: '128px', border: 'neon-cyan' },
                  { rotate: 'rotateX(-90deg)', trans: '128px', border: 'neon-purple' },
                ].map((face, idx) => (
                  <div 
                    key={idx}
                    className={`absolute inset-0 bg-black/20 border border-${face.border}/30 backdrop-blur-sm`} 
                    style={{ transform: `${face.rotate} translateZ(${face.trans})` }}
                  >
                    <div className="absolute inset-4 border border-dashed border-white/10 opacity-50"></div>
                  </div>
                ))}
                
                 {/* Orbitals */}
                 <div className="absolute -inset-16 border border-neon-cyan/20 rounded-full animate-[spin_10s_linear_infinite]" style={{ transform: 'rotateX(90deg)' }}></div>
                 <div className="absolute -inset-24 border border-neon-purple/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" style={{ transform: 'rotateY(90deg)' }}></div>
             </div>
          </div>
        </div>
      </section>
      {/* Spacer to allow scrolling past fixed hero */}
      <div className="h-screen w-full invisible pointer-events-none relative z-0"></div>
    </>
  );
};

export default Hero;