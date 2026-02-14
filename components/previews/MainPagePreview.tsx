'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uPrevMouse;
  uniform float uStrength;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float dist = distance(uv, uMouse);
    vec2 mouseDir = uMouse - uPrevMouse;
    float radius = 0.35;
    float softness = 0.2;
    float influence = smoothstep(radius, radius - softness, dist);
    vec2 pull = mouseDir * influence * uStrength * 3.0;
    vec2 toMouse = uMouse - uv;
    float stretchAmount = influence * uStrength * 0.5;
    vec2 stretch = normalize(toMouse + 0.001) * stretchAmount * (1.0 - dist);
    float fragFreq = 8.0;
    float fragAmp = 0.03 * influence * uStrength;
    vec2 frag = vec2(
      sin(uv.y * fragFreq + uTime * 2.0 + dist * 10.0) * fragAmp,
      cos(uv.x * fragFreq + uTime * 2.0 + dist * 10.0) * fragAmp
    );
    float meltAmount = influence * uStrength * 0.15;
    float melt = sin(uv.x * 15.0 + uTime * 3.0) * meltAmount;
    uv += pull + stretch + frag;
    uv.y += melt;
    float chromaOffset = influence * 0.01 * uStrength;
    vec4 colorR = texture2D(uTexture, uv + vec2(chromaOffset, 0.0));
    vec4 colorG = texture2D(uTexture, uv);
    vec4 colorB = texture2D(uTexture, uv - vec2(chromaOffset, 0.0));
    gl_FragColor = vec4(colorR.r, colorG.g, colorB.b, colorG.a);
  }
`;

function DistortedText({ text, position, fontSize = 1 }: { 
  text: string; 
  position: [number, number, number]; 
  fontSize?: number 
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const strengthRef = useRef(0);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold ${fontSize * 120}px Inter, system-ui, sans-serif`;
    ctx.fillStyle = '#1a1a1a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    setTexture(tex);
  }, [text, fontSize]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      const targetX = mouseRef.current.x;
      const targetY = mouseRef.current.y;
      const currentX = materialRef.current.uniforms.uMouse.value.x;
      const currentY = materialRef.current.uniforms.uMouse.value.y;
      const smoothX = currentX + (targetX - currentX) * 0.1;
      const smoothY = currentY + (targetY - currentY) * 0.1;
      materialRef.current.uniforms.uPrevMouse.value.set(currentX, currentY);
      materialRef.current.uniforms.uMouse.value.set(smoothX, smoothY);
      const speed = Math.sqrt(Math.pow(targetX - currentX, 2) + Math.pow(targetY - currentY, 2));
      const targetStrength = Math.min(speed * 50, 1.5);
      strengthRef.current += (targetStrength - strengthRef.current) * 0.1;
      materialRef.current.uniforms.uStrength.value = Math.max(strengthRef.current, 0.3);
    }
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1.0 - e.clientY / window.innerHeight
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!texture) return null;
  const aspect = 1024 / 256;
  const width = fontSize * 4.5;
  const height = width / aspect;

  return (
    <mesh position={position}>
      <planeGeometry args={[width, height, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTexture: { value: texture },
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uPrevMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uStrength: { value: 0.5 }
        }}
        transparent
      />
    </mesh>
  );
}

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

  const handleMouseEnter = () => { if (!isHovering) { setIsHovering(true); scramble(); } };
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
      className={`font-mono text-[10px] tracking-wider cursor-pointer transition-colors ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText}
    </span>
  );
}

function ScrollToExplore() {
  const { displayText, handleMouseEnter, handleMouseLeave } = useTextScramble('[SCROLL TO EXPLORE]');
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="font-mono text-[8px] tracking-widest text-black/60 cursor-pointer hover:text-black transition-colors">
        {displayText}
      </span>
    </motion.div>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1} />
      <DistortedText text="Eva" position={[-0.4, 0.25, 0]} fontSize={0.7} />
      <DistortedText text="Sánchez" position={[0.2, -0.25, 0]} fontSize={0.7} />
    </>
  );
}

export default function MainPagePreview() {
  return (
    <div className="w-full h-full bg-[#f5f5f0] rounded-sm overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px)',
          backgroundSize: '50px 100%'
        }} />
      </div>
      <nav className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-4 py-3">
        <div className="flex gap-4">
          <ScrambleLink text="INDEX" className="text-black hover:text-black/60" />
          <ScrambleLink text="ABOUT" className="text-black hover:text-black/60" />
        </div>
        <div className="bg-black px-2 py-1">
          <ScrambleLink text="TALK" className="text-white hover:text-white/80" />
        </div>
      </nav>
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <Scene />
        </Canvas>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-12 z-20 text-center"
      >
        <p className="text-[10px] font-medium text-black/80">Interactive Designer</p>
        <p className="text-[10px] font-medium text-black/80">Based in Barcelona</p>
      </motion.div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <ScrollToExplore />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-3 left-0 right-0 flex justify-center gap-4 z-50"
      >
        <ScrambleLink text="IG" className="text-[8px] text-black/60 hover:text-black" />
        <ScrambleLink text="LI" className="text-[8px] text-black/60 hover:text-black" />
        <ScrambleLink text="CV" className="text-[8px] text-black/60 hover:text-black" />
      </motion.div>
    </div>
  );
}
