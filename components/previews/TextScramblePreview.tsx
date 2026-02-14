'use client';

import { useState, useRef } from 'react';

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
        originalText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration / 3) return originalText[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
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
    if (!isHovering) {
      setIsHovering(true);
      scramble();
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    setDisplayText(originalText);
  };

  return { displayText, handleMouseEnter, handleMouseLeave };
};

function ScrambleLink({ text, className = '' }: { text: string; className?: string }) {
  const { displayText, handleMouseEnter, handleMouseLeave } = useTextScramble(text);

  return (
    <span
      className={`font-mono text-sm tracking-wider cursor-pointer transition-colors ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText}
    </span>
  );
}

export default function TextScramblePreview() {
  return (
    <div className="w-full h-full bg-[#f5f5f0] rounded-sm flex flex-col items-center justify-center gap-8 p-8">
      <div className="text-center space-y-2">
        <p className="text-xs text-foreground/50 font-mono mb-4">Passe o mouse sobre os textos</p>
      </div>
      
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-8">
          <ScrambleLink text="INDEX" className="text-foreground hover:text-foreground/60" />
          <ScrambleLink text="ABOUT" className="text-foreground hover:text-foreground/60" />
          <ScrambleLink text="PLAYGROUND" className="text-foreground hover:text-foreground/60" />
        </div>
        
        <div className="bg-foreground px-4 py-2">
          <ScrambleLink text="LETS TALK" className="text-background hover:text-background/80" />
        </div>
        
        <div className="mt-8 flex gap-6">
          <ScrambleLink text="INSTAGRAM" className="text-xs text-foreground/60 hover:text-foreground" />
          <ScrambleLink text="LINKEDIN" className="text-xs text-foreground/60 hover:text-foreground" />
          <ScrambleLink text="READ.CV" className="text-xs text-foreground/60 hover:text-foreground" />
        </div>
      </div>
    </div>
  );
}
