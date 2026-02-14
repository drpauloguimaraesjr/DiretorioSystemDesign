'use client';

import { useEffect, useRef, useState } from 'react';

function RevealLetter({ 
  char, 
  index, 
  mouseX, 
  mouseY,
  isHovering 
}: { 
  char: string; 
  index: number; 
  mouseX: number;
  mouseY: number;
  isHovering: boolean;
}) {
  const letterRef = useRef<HTMLSpanElement>(null);
  const [clipPath, setClipPath] = useState('');
  const [transform, setTransform] = useState('');

  useEffect(() => {
    if (!letterRef.current) return;
    
    const rect = letterRef.current.getBoundingClientRect();
    const letterCenterX = rect.left + rect.width / 2;
    const letterCenterY = rect.top + rect.height / 2;
    
    const distX = mouseX - letterCenterX;
    const distY = mouseY - letterCenterY;
    const distance = Math.sqrt(distX * distX + distY * distY);
    
    const radius = 120;
    const influence = Math.max(0, 1 - distance / radius);
    
    const seed = index * 137.5;
    const baseCut = 20 + Math.sin(seed) * 15;
    const currentCut = baseCut * (1 - influence);
    
    setClipPath(`inset(${currentCut}% ${currentCut * 0.5}% ${currentCut}% ${currentCut * 0.8}%)`);
    setTransform(`translateY(${(1 - influence) * (index % 2 === 0 ? 8 : -8)}px)`);
  }, [mouseX, mouseY, isHovering, index]);

  return (
    <span
      ref={letterRef}
      className="inline-block transition-all duration-100 ease-out will-change-transform"
      style={{ clipPath, transform }}
    >
      {char}
    </span>
  );
}

function RevealText({ text, className = '' }: { text: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const chars = text.split('');

  return (
    <div
      ref={containerRef}
      className={`cursor-default select-none ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {chars.map((char, index) => (
        <RevealLetter
          key={index}
          char={char === ' ' ? '\u00A0' : char}
          index={index}
          mouseX={mousePos.x}
          mouseY={mousePos.y}
          isHovering={isHovering}
        />
      ))}
    </div>
  );
}

export default function RevealTextPreview() {
  return (
    <div className="w-full h-full bg-[#f5f5f0] rounded-sm overflow-hidden relative flex flex-col items-center justify-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px)',
          backgroundSize: '50px 100%'
        }} />
      </div>
      <div className="z-10 text-center">
        <RevealText 
          text="Eva" 
          className="text-6xl font-bold leading-none tracking-tighter text-black block"
        />
        <RevealText 
          text="Sánchez" 
          className="text-6xl font-bold leading-none tracking-tighter text-black block -mt-2"
        />
      </div>
      <div className="absolute bottom-4 left-4 text-xs text-foreground/50 font-mono">
        Mova o mouse para revelar
      </div>
    </div>
  );
}
