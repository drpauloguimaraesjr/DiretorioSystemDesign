'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const useTextScramble = (originalText: string) => {
  const [displayText, setDisplayText] = useState(originalText);
  const [isHovering, setIsHovering] = useState(false);
  const frameRef = useRef<number | undefined>(undefined);
  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789';

  const scramble = () => {
    let iteration = 0;
    const maxIterations = originalText.length * 3;
    const animate = () => {
      setDisplayText(
        originalText.split('').map((char, index) => {
          if (char === ' ') return ' ';
          if (index < iteration / 3) return originalText[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
      iteration++;
      if (iteration < maxIterations) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(originalText);
      }
    };
    animate();
  };

  const handleMouseEnter = () => {
    if (!isHovering) { setIsHovering(true); scramble(); }
  };
  const handleMouseLeave = () => {
    setIsHovering(false);
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    setDisplayText(originalText);
  };

  return { displayText, handleMouseEnter, handleMouseLeave };
};

function ScrollToExplore() {
  const { displayText, handleMouseEnter, handleMouseLeave } = useTextScramble('[SCROLL TO EXPLORE]');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="text-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="font-mono text-xs tracking-widest text-foreground/60 cursor-pointer hover:text-foreground transition-colors">
        {displayText}
      </span>
    </motion.div>
  );
}

export default function ScrollToExplorePreview() {
  const [key, setKey] = useState(0);

  return (
    <div className="w-full h-full bg-[#f5f5f0] rounded-sm flex flex-col items-center justify-center gap-8 p-8">
      <div className="text-center space-y-2">
        <p className="text-xs text-foreground/50 font-mono mb-4">Animação de entrada + scramble no hover</p>
      </div>
      
      <ScrollToExplore key={key} />
      
      <button 
        onClick={() => setKey(k => k + 1)}
        className="mt-8 px-4 py-2 text-xs font-mono border border-foreground/20 hover:border-foreground/40 transition-colors"
      >
        Replay Animation
      </button>
    </div>
  );
}
