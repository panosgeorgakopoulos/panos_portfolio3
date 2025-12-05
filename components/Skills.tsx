import React, { useState, useEffect, useRef } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { SKILLS } from '../constants';

// 1. Defined a Custom Tooltip Component for the % display
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a0a0a] border border-white/10 p-3 rounded shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <p className="font-display font-bold text-white mb-1">{label}</p>
        <p className="font-mono text-neon-cyan text-sm">
          Engagement: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

const Skills: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
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
      id="skills" 
      ref={sectionRef}
      className="relative min-h-screen bg-black border-t border-white/10 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col justify-center py-20 z-20"
    >
      <div className={`max-w-7xl mx-auto px-6 w-full ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="order-2 lg:order-1">
             <div className="h-[500px] w-full bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={SKILLS}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                  >
                    <XAxis type="number" hide domain={[0, 100]} />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={120} 
                      tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    {/* 2. Used the CustomTooltip here */}
                    <Tooltip 
                      content={<CustomTooltip />}
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    />
                    <Bar 
                      dataKey="level" 
                      barSize={16}
                      radius={[0, 4, 4, 0]}
                      onMouseEnter={(_, index) => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      {SKILLS.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          // 3. Updated color logic to treat 'Backend' as the purple accent
                          fill={
                            entry.category === 'Frontend' ? '#00f0ff' : 
                            (entry.category === 'Backend' ? '#bd00ff' : '#00ff94')
                          } 
                          fillOpacity={activeIndex === null || activeIndex === index ? 1 : 0.3}
                          className="transition-all duration-300"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-4 mb-4">
               <span className="text-neon-cyan font-mono text-xs tracking-widest">02 / CAPABILITIES</span>
               <div className="h-[1px] flex-1 bg-white/10"></div>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8">
              TECH STACK
            </h2>
            {/* 4. Sanitized text to remove "AI integration" */}
            <p className="text-slate-400 font-light leading-relaxed mb-8 text-lg">
              My technical arsenal is a curated blend of foundational engineering and robust software architecture. I specialize in building systems that are efficient, reliable, and scalable.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-white/5 rounded bg-white/[0.02]">
                <div className="text-neon-cyan font-mono text-xl mb-1">03+</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">Years Exp</div>
              </div>
              <div className="p-4 border border-white/5 rounded bg-white/[0.02]">
                <div className="text-neon-purple font-mono text-xl mb-1">100%</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">Commitment</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Skills;