'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

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

function Scene() {
  return (
    <>
      <ambientLight intensity={1} />
      <DistortedText text="Eva" position={[-0.5, 0.4, 0]} fontSize={1.1} />
      <DistortedText text="Sánchez" position={[0.2, -0.4, 0]} fontSize={1.1} />
    </>
  );
}

export default function Scene3DPreview() {
  return (
    <div className="w-full h-full bg-[#f5f5f0] rounded-sm overflow-hidden relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Scene />
      </Canvas>
      <div className="absolute bottom-4 left-4 text-xs text-foreground/50 font-mono">
        Cena com ambientLight + múltiplos textos
      </div>
    </div>
  );
}
