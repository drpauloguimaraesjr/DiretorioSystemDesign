"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Download } from "lucide-react";

interface AnimatedLogoProps {
  size?: number;
  speed?: number; // Velocidade do loop em segundos
  autoPlay?: boolean;
  color?: string;
}

export default function AnimatedLogoDNA({ 
  size = 200, 
  speed = 15, 
  autoPlay = true,
  color = "#1a1a1a"
}: AnimatedLogoProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isRecording, setIsRecording] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // ViewBox do Quadrado: 169.33 x 169.33
  const squareW = 169.33;
  const squareH = 169.33;
  
  // O DNA path fornecido no snippet
  const dnaPath = "M11.91,17.41c2.43.35,10.69-.12,13.25-.17.26-.01,1.06,0,1.31,0s-.46.39-.62.53a47.49,47.49,0,0,0-10.45,15,50,50,0,0,0-1.89,4A65.64,65.64,0,0,0,9,47.88a107.56,107.56,0,0,0-2,15.8c-.37,4.8-.44,9.64-.17,14.43a131,131,0,0,0,3.31,23L12,105.74V105c.16-5,.67-10.12,1.38-15.11a140.75,140.75,0,0,1,3.48-18.06c.21-.86.41-1.74.65-2.61a79.24,79.24,0,0,1,3.75-11,54.77,54.77,0,0,1,10.37-16.14,46.12,46.12,0,0,1,7.24-6.49A32,32,0,0,1,47.78,30.3a21.36,21.36,0,0,1,5.18-1.5,53.25,53.25,0,0,1,8.39-.77h.35s-.76.54-1,.76a52.51,52.51,0,0,0-6.19,6.08,46.22,46.22,0,0,0-8.23,13.79c-.58,1.44-1.07,2.94-1.54,4.44a101,101,0,0,0-4,15.22c-.66,3.84-.95,7.74-1.2,11.64v.5V111h-1V79.26h-1c-.05,4.78.29,9.58,1,14.33a105.51,105.51,0,0,0,1.91,10V105h-1c-.13.91.56,3.7.83,4.6L44,116Z";
  
  useEffect(() => {
    setIsPlaying(autoPlay);
  }, [autoPlay]);

  const handleDownloadVideo = () => {
    if (!svgRef.current || !containerRef.current) return;
    setIsRecording(true);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = size * 2; // Alta resolução
    canvas.height = size * 2;
    
    // Configura fundo do grid conforme no site
    if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const stream = canvas.captureStream(60);
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });
    const chunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "animacao-logo-nutribuddy.webm"; // WebM para alta compatibilidade nativa
      a.click();
      URL.revokeObjectURL(url);
      setIsRecording(false);
    };

    mediaRecorder.start();

    // Render SVG para Canvas framerate fixo durante um ciclo
    const startTime = performance.now();
    let currentY = 0;

    const renderFrame = (timestamp: number) => {
        const elapsed = (timestamp - startTime) / 1000;
        
        // Simular o loop: duration = speed. y move de 0 to -412.63
        const progress = (elapsed % speed) / speed;
        currentY = -(progress * 412.63);

        const svgClone = svgRef.current!.cloneNode(true) as SVGSVGElement;
        
        // Injetar manual Y pos na viewbox/estilo do DNA (como a motion faz)
        const motionGroup = svgClone.querySelector("#anim-group");
        if (motionGroup) {
            motionGroup.setAttribute("transform", `translate(10, ${10 + currentY})`);
        }

        const svgData = new XMLSerializer().serializeToString(svgClone);
        const img = new Image();
        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
        
        img.onload = () => {
            if (ctx) {
                ctx.fillStyle = "#f8f6f2"; // Creme background
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
        };

        if (elapsed < speed * 1.05 && isRecording) { // Grava 1 ciclo completo + 5% margem 
            requestAnimationFrame(renderFrame);
        } else if (isRecording) {
            mediaRecorder.stop();
        }
    };

    requestAnimationFrame(renderFrame);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-neutral-50 rounded-sm border border-neutral-200">
      <div 
        ref={containerRef}
        className="relative flex items-center justify-center p-8 bg-[#f8f6f2] rounded-md shadow-inner"
        style={{ width: size + 60, height: size + 60 }}
      >
        <svg
          ref={svgRef}
          width={size}
          height={size}
          viewBox={`0 0 ${squareW} ${squareH}`}
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: "visible" }}
        >
          <defs>
            <clipPath id="square-clip">
              <rect x="10.2" y="10.2" width="148.93" height="148.93" fill="none" />
            </clipPath>
            
            <g id="dna-pattern">
              <path d={dnaPath} fill={color} />
              {/* Segundo path para loop infinito suave */}
              <path d={dnaPath} fill={color} transform="translate(0, 412.63)" />
            </g>
          </defs>

          {/* Borda do Quadrado com cantos arredondados */}
          <path
            d="M159.13,169.33H10.2c-5.63,0-10.2-4.57-10.2-10.2V10.2C0,4.57,4.57,0,10.2,0H159.13c5.63,0,10.2,4.57,10.2,10.2V159.13c0,5.63-4.57,10.2-10.2,10.2ZM10.2,2.4c-4.3,0-7.8,3.5-7.8,7.8V159.13c0,4.3,3.5,7.8,7.8,7.8H159.13c4.3,0,7.8-3.5,7.8-7.8V10.2c0-4.3-3.5-7.8-7.8-7.8H10.2Z"
            fill={color}
          />

          {/* DNA Animado com clip-path */}
          <g clipPath="url(#square-clip)">
            <motion.g
              id="anim-group"
              animate={isPlaying ? {
                y: [0, -412.63]
              } : { y: 0 }}
              transition={{
                duration: speed,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ x: 10, y: 10 }}
            >
              <use href="#dna-pattern" transform="scale(0.36)" />
            </motion.g>
          </g>
        </svg>
      </div>

      <button 
          onClick={handleDownloadVideo}
          disabled={isRecording}
          className="flex items-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-sm text-sm font-medium transition-colors disabled:opacity-50"
      >
          <Download size={16} /> 
          {isRecording ? "Gravando Ciclo de Animação..." : "Baixar Animação em Vídeo (WebM)"}
      </button>
      <p className="text-xs text-neutral-500 font-mono text-center max-w-xs">
          O formato WebM oferece alta qualidade com suporte nativo direto do navegador. AVI não é um standard web nativo.
      </p>
    </div>
  );
}
