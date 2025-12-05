import React, { useState } from 'react';
import { Menu, X, Cpu } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Experience', href: '#experience' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
  ];

  // Helper function to handle smooth scroll to top
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    // Update URL hash without jumping (optional, keeps URL clean)
    history.pushState(null, "", window.location.pathname);
  };

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:block w-auto">
        <div className="glass rounded-full px-8 py-4 flex items-center gap-10 shadow-[0_0_30px_rgba(0,240,255,0.1)] border border-white/10">
          {/* Logo - Desktop (Fixed) */}
          <a 
            href="#" 
            onClick={scrollToTop} 
            className="flex items-center gap-2 group cursor-pointer"
          >
            <Cpu className="text-neon-cyan group-hover:animate-spin-slow transition-all duration-500" size={20} />
            <span className="font-display font-bold text-lg tracking-wider text-white">
              PANOS<span className="text-neon-purple">.DEV</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="flex items-center gap-8">
            {navItems.map(item => (
              <a 
                key={item.label}
                href={item.href}
                className="text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-neon-cyan transition-colors"
              >
                {item.label}
              </a>
            ))}
            <a 
              href="#contact" 
              className="px-6 py-2 text-xs font-bold uppercase tracking-wider text-black bg-neon-cyan rounded-full hover:bg-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.6)] hover:scale-105"
            >
              Hire Me
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-6 h-16 flex items-center justify-between">
         {/* Logo - Mobile (Fixed) */}
         <a 
            href="#" 
            onClick={scrollToTop}
            className="flex items-center gap-2"
         >
            <Cpu className="text-neon-cyan" size={20} />
            <span className="font-display font-bold text-lg tracking-wider text-white">
              PANOS<span className="text-neon-purple">.DEV</span>
            </span>
          </a>
        <button 
          className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 animate-fade-in-up">
           {navItems.map(item => (
            <a 
              key={item.label}
              href={item.href}
              className="text-3xl font-display font-light text-white hover:text-neon-cyan tracking-widest uppercase transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a 
            href="#contact" 
            className="text-xl font-mono text-neon-cyan mt-8 border border-neon-cyan/30 px-8 py-3 rounded-full hover:bg-neon-cyan/10"
            onClick={() => setIsMenuOpen(false)}
          >
            [ INITIATE_CONTACT ]
          </a>
        </div>
      )}
    </>
  );
};

export default Navbar;