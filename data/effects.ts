export interface Effect {
  id: string;
  name: string;
  description: string;
  category: string;
  code: string;
}

export const effects: Effect[] = [
  // =============================================
  // CATEGORIA: SISTEMA
  // =============================================
  {
    id: "system-layout",
    name: "Layout Principal",
    description: "Estrutura do sistema com sidebar de navegação, área de preview e exibição de código. Usa Playfair Display para títulos, Inter para corpo e JetBrains Mono para código.",
    category: "Sistema",
    code: `// ============================================
// LAYOUT PRINCIPAL - app/page.tsx
// ============================================
'use client';

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { effects, categories } from '@/data/effects';
import CodeDisplay from '@/components/CodeDisplay';

export default function Home() {
  const [selectedEffect, setSelectedEffect] = useState(effects[0]);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Índice de Exposição */}
      <aside className="w-72 border-r border-border flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-border">
          <h1 className="font-serif text-2xl font-semibold tracking-tight">
            Paulo Guimarães
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            System design
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto sidebar-scroll p-4">
          {categories.map((category) => (
            <div key={category} className="mb-6">
              <h2 className="text-xs font-mono uppercase tracking-widest
                text-muted-foreground mb-3 px-2">
                {category}
              </h2>
              <ul className="space-y-1">
                {effects
                  .filter((e) => e.category === category)
                  .map((effect) => {
                    const globalIndex = effects.findIndex(
                      (e) => e.id === effect.id
                    ) + 1;
                    const isSelected = selectedEffect.id === effect.id;
                    return (
                      <li key={effect.id}>
                        <button
                          onClick={() => setSelectedEffect(effect)}
                          className={\`w-full text-left px-3 py-2.5
                            rounded-sm transition-all duration-200
                            flex items-start gap-3 \${
                            isSelected
                              ? 'bg-foreground text-background'
                              : 'hover:bg-muted'
                          }\`}
                        >
                          <span className={\`font-serif text-lg
                            leading-none mt-0.5 \${
                            isSelected
                              ? 'text-background/60'
                              : 'text-muted-foreground'
                          }\`}>
                            {String(globalIndex).padStart(2, '0')}
                          </span>
                          <span className="text-sm font-medium truncate">
                            {effect.name}
                          </span>
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground
            text-center font-mono">
            {effects.length} efeitos disponíveis
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="p-6 border-b border-border
          flex items-end justify-between">
          <div>
            <motion.span
              key={selectedEffect.id + '-index'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-5xl
                text-muted-foreground/30 block leading-none"
            >
              {String(effects.findIndex(
                (e) => e.id === selectedEffect.id
              ) + 1).padStart(2, '0')}
            </motion.span>
            <motion.h2
              key={selectedEffect.id + '-title'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-3xl font-semibold mt-2"
            >
              {selectedEffect.name}
            </motion.h2>
          </div>
          <motion.span
            key={selectedEffect.id + '-category'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-mono uppercase
              tracking-widest text-muted-foreground"
          >
            {selectedEffect.category}
          </motion.span>
        </header>

        <div className="flex-1 p-6 flex flex-col gap-6 overflow-auto">
          {/* Description */}
          <AnimatePresence mode="wait">
            <motion.p
              key={selectedEffect.id + '-desc'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-muted-foreground max-w-2xl"
            >
              {selectedEffect.description}
            </motion.p>
          </AnimatePresence>

          {/* Preview */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedEffect.id + '-preview'}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="border border-border rounded-sm
                overflow-hidden bg-card"
              style={{ height: '400px' }}
            >
              <Suspense fallback={<div>Loading...</div>}>
                {/* Preview component here */}
              </Suspense>
            </motion.div>
          </AnimatePresence>

          {/* Code */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedEffect.id + '-code'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
            >
              <CodeDisplay
                code={selectedEffect.code}
                title={\`\${selectedEffect.name
                  .toLowerCase()
                  .replace(/\\s+/g, '-')}.tsx\`}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}`
  },
  {
    id: "system-code-display",
    name: "Code Display",
    description: "Componente de exibição de código com números de linha, botão de copiar e scrollbar customizado. Usa JetBrains Mono como fonte.",
    category: "Sistema",
    code: `// ============================================
// COMPONENTE CODE DISPLAY - components/CodeDisplay.tsx
// ============================================
'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeDisplayProps {
  code: string;
  title?: string;
}

export default function CodeDisplay({ code, title }: CodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\\n');

  return (
    <div className="border border-border bg-card rounded-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2
        border-b border-border bg-muted/30">
        <span className="font-mono text-xs text-muted-foreground">
          {title || 'código'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs
            text-muted-foreground hover:text-foreground
            transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copiado</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-auto code-scrollbar max-h-[400px]">
        <div className="flex">
          {/* Line numbers */}
          <div className="flex-shrink-0 py-4 px-3 text-right
            border-r border-border bg-muted/20 select-none">
            {lines.map((_, i) => (
              <div key={i} className="font-mono text-xs
                text-muted-foreground/50 leading-6">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code content */}
          <pre className="flex-1 py-4 px-4 overflow-x-auto">
            <code className="font-mono text-xs leading-6
              text-foreground whitespace-pre">
              {code}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}`
  },
  {
    id: "system-globals",
    name: "Estilos Globais",
    description: "CSS global do sistema com Tailwind, scrollbars customizados e configuração de fontes. Cores neutras off-white inspiradas em galeria de arte.",
    category: "Sistema",
    code: `/* ============================================ */
/* ESTILOS GLOBAIS - app/globals.css            */
/* ============================================ */
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html, body {
  max-width: 100vw;
  overflow-x: hidden;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom scrollbar for code blocks */
.code-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.code-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.code-scrollbar::-webkit-scrollbar-thumb {
  background: #b0afa8;
  border-radius: 3px;
}

/* Sidebar scrollbar */
.sidebar-scroll::-webkit-scrollbar {
  width: 4px;
}

.sidebar-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-scroll::-webkit-scrollbar-thumb {
  background: #d0cfc8;
  border-radius: 2px;
}

/* ============================================ */
/* TAILWIND CONFIG - tailwind.config.js         */
/* ============================================ */
/* 
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    serif: ['Playfair Display', 'Georgia', 'serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
  },
  colors: {
    background: '#f7f6f3',
    foreground: '#1a1a18',
    card: '#ffffff',
    muted: '#edece8',
    'muted-foreground': '#78776e',
    border: '#e0dfd8',
    accent: '#edece8',
  }
*/`
  },

  // =============================================
  // CATEGORIA: REACT HOOKS
  // =============================================
  {
    id: "text-scramble",
    name: "Text Scramble",
    description: "Hook React que cria efeito de embaralhamento de texto com caracteres aleatórios ao passar o mouse.",
    category: "React Hooks",
    code: `// ============================================
// EFEITO DE SCRAMBLE NOS LINKS
// ============================================
const useTextScramble = (originalText: string) => {
  const [displayText, setDisplayText] = useState(originalText);
  const [isHovering, setIsHovering] = useState(false);
  const frameRef = useRef<number>();
  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~\\\`0123456789';

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
};`
  },

  // =============================================
  // CATEGORIA: REACT COMPONENTS
  // =============================================
  {
    id: "scramble-link",
    name: "Scramble Link",
    description: "Componente de link que utiliza o hook useTextScramble para criar efeito de embaralhamento interativo.",
    category: "React Components",
    code: `// ============================================
// COMPONENTE SCRAMBLE LINK
// ============================================
function ScrambleLink({ 
  text, 
  href = '#', 
  className = '' 
}: { 
  text: string; 
  href?: string; 
  className?: string 
}) {
  const { displayText, handleMouseEnter, handleMouseLeave } = useTextScramble(text);

  return (
    <a
      href={href}
      className={\\\`font-mono text-sm tracking-wider transition-colors \\\${className}\\\`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText}
    </a>
  );
}`
  },

  // =============================================
  // CATEGORIA: FRAMER MOTION
  // =============================================
  {
    id: "scroll-to-explore",
    name: "Scroll To Explore",
    description: "Componente animado com Framer Motion que combina fade-in com o efeito de text scramble.",
    category: "Framer Motion",
    code: `// ============================================
// COMPONENTE SCROLL TO EXPLORE COM SCRAMBLE
// ============================================
function ScrollToExplore() {
  const { displayText, handleMouseEnter, handleMouseLeave } = useTextScramble(
    '[SCROLL TO EXPLORE]'
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="font-mono text-xs tracking-widest text-black/60
        cursor-pointer hover:text-black transition-colors">
        {displayText}
      </span>
    </motion.div>
  }
}`
  },

  // =============================================
  // CATEGORIA: SVG ANIMATION
  // =============================================
  {
    id: "animated-logo-data",
    name: "Logo DNA - Data",
    description: "Variação alternativa da animação do DNA focada em apresentação de dados ou conexão em rede.",
    category: "SVG Animation",
    code: `// ============================================
// ANIMATED LOGO COM LOTTIE REACT (COLORIZÁVEL E TRANSPARENTE)
// ============================================
// Instalação da dependência:
// npm install lottie-react
//
// NOTA IMPORTANTE:
// Certifique-se de copiar o arquivo JSON respectivo para o seu projeto:
// (animation-dna-data.json)
// ============================================

"use client";

import React from "react";
import Lottie from "lottie-react";
// Ajuste o caminho de importação conforme a estrutura de pastas!
import animationData from "./data/animation-dna-data.json";

interface DNADataLogoProps {
  color?: string; // Customiza a cor de preenchimento
  size?: number | string; // Tamanho base
  className?: string; // Classes HTML
}

export default function LogoDNAData({ 
  color = "#000000",
  size  = 300,
  className = ""
}: DNADataLogoProps) {
  return (
    <div 
      className={\`flex items-center justify-center \${className}\`}
      style={{ width: size, height: size }}
    >
      <div style={{ width: "100%", height: "100%", color: color }}>
        <Lottie 
            animationData={animationData} 
            loop={true} 
            // Injeta cor em todas as layers de shapes e strokes do SVG instanciado em tela
            className="w-full h-full [&_path]:fill-current [&_path[stroke]]:stroke-current"
            
            rendererSettings={{ 
                preserveAspectRatio: "xMidYMid meet",
                clearCanvas: true // Fundo transparente por padrão
            }}
        />
      </div>
    </div>
  );
}`
  },

  // =============================================
  // CATEGORIA: UI COMPONENTS
  // =============================================
  {
    id: "animate-tabs",
    name: "Animate Tabs",
    description: "Componente de Tabs com animações suaves de transição entre conteúdos. Utiliza shadcn/ui como base e animate-ui para as transições. Ideal para formulários e painéis de configuração.",
    category: "UI Components",
    code: `// ============================================
// ANIMATE TABS - TABS COM TRANSIÇÕES SUAVES
// ============================================
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from '@/components/animate-ui/components/animate/tabs';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AnimateTabsDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <Card className="shadow-none py-0">
          <TabsContents className="py-6">
            <TabsContent value="account" className="flex flex-col gap-6">
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Make changes to your account here. Click save when you're done.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-name">Name</Label>
                  <Input id="tabs-demo-name" defaultValue="Pedro Duarte" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </TabsContent>
            <TabsContent value="password" className="flex flex-col gap-6">
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-current">Current password</Label>
                  <Input id="tabs-demo-current" type="password" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-new">New password</Label>
                  <Input id="tabs-demo-new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </TabsContent>
          </TabsContents>
        </Card>
      </Tabs>
    </div>
  );
}

// ============================================
// DEPENDÊNCIAS NECESSÁRIAS
// ============================================
// npm install @radix-ui/react-tabs
// npm install framer-motion
// shadcn/ui: npx shadcn-ui@latest add card button input label

// ============================================
// ESTRUTURA DOS COMPONENTES
// ============================================
// - Tabs: Container principal com contexto de estado
// - TabsList: Barra de navegação com triggers
// - TabsTrigger: Botão de cada aba com indicador animado
// - TabsContents: Wrapper com AnimatePresence
// - TabsContent: Conteúdo de cada aba com motion.div`
  },
  {
    id: "share-button",
    name: "Share Button",
    description: "Botão de compartilhamento animado com suporte a diferentes tamanhos e ícones customizáveis. Ideal para ações de compartilhamento em redes sociais ou copiar links.",
    category: "UI Components",
    code: `// ============================================
// SHARE BUTTON - BOTÃO DE COMPARTILHAMENTO ANIMADO
// ============================================
'use client';

import {
  ShareButton,
  type ShareButtonProps,
} from '@/components/animate-ui/components/community/share-button';

type ShareButtonDemoProps = {
  size?: ShareButtonProps['size'];
  icon?: ShareButtonProps['icon'];
};

export const ShareButtonDemo = ({ size, icon }: ShareButtonDemoProps) => {
  return (
    <ShareButton size={size} icon={icon}>
      Share
    </ShareButton>
  );
};

// ============================================
// EXEMPLO DE USO
// ============================================
// Tamanho padrão
// <ShareButtonDemo />

// Tamanho grande
// <ShareButtonDemo size="lg" />

// Com ícone customizado
// <ShareButtonDemo icon={<LinkIcon />} />

// ============================================
// PROPS DISPONÍVEIS
// ============================================
// size: 'sm' | 'md' | 'lg' - Tamanho do botão
// icon: ReactNode - Ícone customizado (opcional)
// children: ReactNode - Texto do botão`
  },
  {
    id: "theme-toggler",
    name: "Theme Toggler Button",
    description: "Botão animado para alternar entre temas Dark Mode, Light Mode e System. Suporta diferentes variantes, tamanhos e direções de animação.",
    category: "UI Components",
    code: `// ============================================
// THEME TOGGLER - ALTERNADOR DE TEMA ANIMADO
// ============================================
import {
  ThemeTogglerButton,
  type ThemeTogglerButtonProps,
} from '@/components/animate-ui/components/buttons/theme-toggler';

interface ThemeTogglerButtonDemoProps {
  variant: ThemeTogglerButtonProps['variant'];
  size: ThemeTogglerButtonProps['size'];
  direction: ThemeTogglerButtonProps['direction'];
  system: boolean;
}

export default function ThemeTogglerButtonDemo({
  variant,
  size,
  direction,
  system,
}: ThemeTogglerButtonDemoProps) {
  return (
    <ThemeTogglerButton
      variant={variant}
      size={size}
      direction={direction}
      modes={system ? ['light', 'dark', 'system'] : ['light', 'dark']}
    />
  );
}

// ============================================
// EXEMPLO DE USO
// ============================================
// Básico (light/dark)
// <ThemeTogglerButtonDemo variant="default" size="md" direction="horizontal" system={false} />

// Com opção System
// <ThemeTogglerButtonDemo variant="outline" size="lg" direction="vertical" system={true} />

// ============================================
// PROPS DISPONÍVEIS
// ============================================
// variant: 'default' | 'outline' | 'ghost' - Estilo visual
// size: 'sm' | 'md' | 'lg' - Tamanho do botão
// direction: 'horizontal' | 'vertical' - Direção da animação
// modes: ('light' | 'dark' | 'system')[] - Modos disponíveis`
  },
  {
    id: "headless-popover",
    name: "Headless Popover",
    description: "Componente Popover animado com ancoragem flexível (12 posições). Baseado em Headless UI com animações suaves. Ideal para formulários inline, configurações e tooltips avançados.",
    category: "UI Components",
    code: `// ============================================
// HEADLESS POPOVER - POPOVER COM ANCORAGEM FLEXÍVEL
// ============================================
import {
  Popover,
  PopoverButton,
  PopoverPanel,
} from '@/components/animate-ui/components/headless/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface HeadlessPopoverDemoProps {
  anchor?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top start'
    | 'top end'
    | 'bottom start'
    | 'bottom end'
    | 'left start'
    | 'left end'
    | 'right start'
    | 'right end';
  gap?: number;
}

export function HeadlessPopoverDemo({
  anchor = 'bottom',
  gap = 4,
}: HeadlessPopoverDemoProps) {
  return (
    <Popover>
      <PopoverButton as={Button} variant="outline">
        Open popover
      </PopoverButton>

      <PopoverPanel anchor={{ to: anchor, gap }} className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Dimensions</h4>
            <p className="text-muted-foreground text-sm">
              Set the dimensions for the layer.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                defaultValue="100%"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxWidth">Max. width</Label>
              <Input
                id="maxWidth"
                defaultValue="300px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                defaultValue="25px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="maxHeight">Max. height</Label>
              <Input
                id="maxHeight"
                defaultValue="none"
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </div>
      </PopoverPanel>
    </Popover>
  );
}

// ============================================
// POSIÇÕES DE ANCORAGEM DISPONÍVEIS
// ============================================
// 'top' | 'bottom' | 'left' | 'right'
// 'top start' | 'top end'
// 'bottom start' | 'bottom end'
// 'left start' | 'left end'
// 'right start' | 'right end'

// ============================================
// EXEMPLO DE USO
// ============================================
// <HeadlessPopoverDemo anchor="bottom" gap={4} />
// <HeadlessPopoverDemo anchor="top end" gap={8} />`
  },

  // =============================================
  // CATEGORIA: INTERACTIVE EFFECTS (do novosite)
  // =============================================
  {
    id: "magnetic",
    name: "Magnetic",
    description: "Wrapper que cria efeito magnético no hover. Qualquer elemento filho 'segue' o cursor com spring suave. Perfeito para botões e CTAs.",
    category: "Interactive Effects",
    code: `// ============================================
// MAGNETIC - EFEITO MAGNÉTICO NO HOVER
// ============================================
"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    const distance = Math.hypot(middleX, middleY);
    const maxDistance = Math.max(width, height) * 0.5;
    const intensity = Math.min(distance / maxDistance, 1) * 0.3;
    
    setPosition({ 
      x: middleX * intensity, 
      y: middleY * intensity 
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    <motion.div
      style={{ position: "relative" }}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x, y }}
      transition={{ 
        type: "spring", 
        stiffness: 50,
        damping: 25,
        mass: 0.5
      }}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// EXEMPLO DE USO
// ============================================
// <Magnetic>
//   <button>Hover me!</button>
// </Magnetic>`
  },
  {
    id: "typing-animation",
    name: "Typing Animation",
    description: "Texto que 'digita' caractere por caractere com cursor piscando. Ativa quando entra no viewport. Props: text, speed, delay, showCursor.",
    category: "Interactive Effects",
    code: `// ============================================
// TYPING ANIMATION - EFEITO DE DIGITAÇÃO
// ============================================
"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { useInView } from "framer-motion";

interface TypingAnimationProps {
    text: string;
    speed?: number;
    delay?: number;
    className?: string;
    showCursor?: boolean;
    onComplete?: () => void;
}

export default function TypingAnimation({ 
    text, 
    speed = 50, 
    delay = 0,
    className = "",
    showCursor = true,
    onComplete
}: TypingAnimationProps) {
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showBlink, setShowBlink] = useState(true);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (!isInView) return;

        const timeout = setTimeout(() => {
            setIsTyping(true);
            let currentIndex = 0;

            const typeInterval = setInterval(() => {
                if (currentIndex < text.length) {
                    setDisplayedText(text.slice(0, currentIndex + 1));
                    currentIndex++;
                } else {
                    clearInterval(typeInterval);
                    setIsTyping(false);
                    setShowBlink(false);
                    if (onComplete) onComplete();
                }
            }, speed);

            return () => clearInterval(typeInterval);
        }, delay);

        return () => clearTimeout(timeout);
    }, [text, speed, delay, isInView, onComplete]);

    return (
        <div ref={ref} className={className} style={{ display: "inline-block" }}>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {displayedText}
                {showCursor && (
                    <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{ marginLeft: "2px" }}
                    >
                        |
                    </motion.span>
                )}
            </motion.span>
        </div>
    );
}`
  },
  {
    id: "floating-cards",
    name: "Floating Cards",
    description: "Grid de cards com efeito 3D parallax no hover (rotateX/Y seguindo o mouse). Animação de reveal ao scroll. Perfeito para galerias e portfólios.",
    category: "Interactive Effects",
    code: `// ============================================
// FLOATING CARDS - CARDS 3D COM TILT
// ============================================
"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useInView } from "framer-motion";

interface FloatingCard {
    id: string | number;
    title: string;
    category?: string;
    image: string;
    description?: string;
}

interface FloatingCardsProps {
    items: FloatingCard[];
    columns?: number;
}

function FloatingCardItem({ item, index, isInView, isHovered, onHover, onLeave }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 300, damping: 30 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 300, damping: 30 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const mouseY = (e.clientY - rect.top - rect.height / 2) / rect.height;
        x.set(mouseX);
        y.set(mouseY);
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); onLeave(); }}
            onMouseEnter={onHover}
            style={{ perspective: "1000px", cursor: "pointer" }}
        >
            <motion.div
                animate={{ scale: isHovered ? 1.05 : 1 }}
                style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    aspectRatio: "4/3",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    transformStyle: "preserve-3d",
                    rotateX, rotateY
                }}
            >
                <motion.img src={item.image} alt={item.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    whileHover={{ scale: 1.1 }}
                />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    style={{
                        position: "absolute", bottom: 0, left: 0, right: 0,
                        padding: "30px",
                        background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
                        color: "#fff"
                    }}
                >
                    {item.category && <span style={{ fontSize: "0.6rem", opacity: 0.7 }}>{item.category}</span>}
                    <h4 style={{ fontSize: "1.2rem", marginTop: "0.5rem" }}>{item.title}</h4>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

// ============================================
// EXEMPLO DE USO
// ============================================
// <FloatingCards items={[
//   { id: 1, title: "Card 1", image: "/img1.jpg", category: "Design" },
//   { id: 2, title: "Card 2", image: "/img2.jpg", category: "Dev" },
// ]} columns={3} />`
  },

  // =============================================
  // CATEGORIA: TEXT ANIMATIONS (do novosite)
  // =============================================
  {
    id: "text-mask-reveal",
    name: "Text Mask Reveal",
    description: "Linhas de texto que sobem de baixo para cima com scroll trigger. Efeito cinematográfico de revelação. Usa GSAP ScrollTrigger.",
    category: "Text Animations",
    code: `// ============================================
// TEXT MASK REVEAL - TEXTO REVELADO POR MÁSCARA
// ============================================
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function TextMaskReveal({ phrase }: { phrase: string[] }) {
  const container = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      ".mask-text-line span",
      { y: "100%" },
      { y: "0%", duration: 1, stagger: 0.1, ease: "power4.out" }
    );
  }, []);

  return (
    <div ref={container} className="mask-reveal-wrapper">
      {phrase.map((line, index) => (
        <div key={index} className="mask-text-line" style={{ overflow: "hidden" }}>
          <span style={{ display: "block" }}>{line}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================
// EXEMPLO DE USO
// ============================================
// <TextMaskReveal phrase={["Transforme", "sua saúde", "com ciência"]} />`
  },
  {
    id: "marquee",
    name: "Marquee",
    description: "Banner com texto infinito rolando horizontalmente em loop contínuo. Efeito CSS puro, sem JavaScript. Ideal para chamadas e destaques.",
    category: "Text Animations",
    code: `// ============================================
// MARQUEE - TEXTO INFINITO ROLANTE
// ============================================
"use client";

export default function Marquee() {
  const text = "NEXT GENERATION DIGITAL EXPERIENCES";

  return (
    <div className="marquee-wrapper">
      <div className="marquee-content">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="marquee-item">
            {text} <span>/</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// CSS NECESSÁRIO
// ============================================
// .marquee-wrapper {
//   overflow: hidden;
//   white-space: nowrap;
//   width: 100%;
// }
// .marquee-content {
//   display: inline-flex;
//   animation: marquee 20s linear infinite;
// }
// .marquee-item {
//   font-size: 4rem;
//   font-weight: 600;
//   padding: 0 2rem;
//   opacity: 0.15;
// }
// @keyframes marquee {
//   0% { transform: translateX(0); }
//   100% { transform: translateX(-50%); }
// }`
  },

  // =============================================
  // CATEGORIA: UTILITY COMPONENTS (do novosite)
  // =============================================
  {
    id: "live-clock",
    name: "Live Clock",
    description: "Componente de relógio em tempo real que mostra a hora local atualizada a cada segundo. React puro, sem dependências externas.",
    category: "Utility Components",
    code: `// ============================================
// LIVE CLOCK - RELÓGIO EM TEMPO REAL
// ============================================
"use client";

import { useState, useEffect } from "react";

export default function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setTime(\`\${hours}:\${minutes}\`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span>[ {time} ]</span>;
}`
  },
  {
    id: "preloader",
    name: "Preloader",
    description: "Tela de carregamento fullscreen com DNA animado, barra de progresso e animação de saída suave. Usa GSAP para transições.",
    category: "Utility Components",
    code: `// ============================================
// PRELOADER - TELA DE LOADING COM DNA
// ============================================
"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { AnimatedLogo } from "./AnimatedLogo";

export default function Preloader() {
  const [percentage, setPercentage] = useState(0);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setPercentage((prev) => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 1;
      });
    }, 15);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (percentage === 100 && mounted) {
      const tl = gsap.timeline({
        onComplete: () => {
          if (containerRef.current) containerRef.current.style.display = "none";
        }
      });
      tl.to(".preloader-content", {
        opacity: 0, y: -40, duration: 0.8, ease: "power3.inOut"
      })
      .to(containerRef.current, {
        yPercent: -100, duration: 1.2, ease: "power4.inOut"
      }, "+=0.2");
    }
  }, [percentage, mounted]);

  return (
    <div ref={containerRef} style={{
      position: "fixed", inset: 0, backgroundColor: "#F8F6F2",
      zIndex: 20000, display: "flex", justifyContent: "center", alignItems: "center"
    }}>
      <div className="preloader-content" style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem"
      }}>
        <AnimatedLogo size={240} speed={2} />
        <div style={{ fontSize: "0.6rem", opacity: 0.3, letterSpacing: "0.1em" }}>
          LOADING EXPERIENCE... {percentage}%
        </div>
      </div>
    </div>
  );
}`
  },

  // =============================================
  // CATEGORIA: PAGE EFFECTS (do novosite)
  // =============================================
  {
    id: "page-transition",
    name: "Page Transition",
    description: "Wrapper com fade + slide vertical para transições suaves entre páginas. Usa AnimatePresence do Framer Motion com pathname do Next.js.",
    category: "Page Effects",
    code: `// ============================================
// PAGE TRANSITION - TRANSIÇÃO DE PÁGINA
// ============================================
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}`
  },
  {
    id: "smooth-scroll",
    name: "Smooth Scroll",
    description: "Wrapper global com Lenis para scroll suave 'pesado' e luxuoso. Sincronizado com GSAP ScrollTrigger. Estilo premium inspirado em Eva Sanchez.",
    category: "Page Effects",
    code: `// ============================================
// SMOOTH SCROLL - SCROLL SUAVE LUXUOSO
// ============================================
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "@/lib/gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
      infinite: false,
      lerp: 0.1,
    });

    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => { lenis.raf(time * 1000); });
    };
  }, []);

  return <>{children}</>;
}

// ============================================
// DEPENDÊNCIAS
// ============================================
// npm install @studio-freight/lenis gsap`
  },

  // =============================================
  // CATEGORIA: SCROLL EFFECTS (do novosite)
  // =============================================
  {
    id: "horizontal-scroll",
    name: "Horizontal Scroll",
    description: "Seção com scroll horizontal controlado por scroll vertical + efeito de skew baseado na velocidade. Usa GSAP ScrollTrigger com pin.",
    category: "Scroll Effects",
    code: `// ============================================
// HORIZONTAL SCROLL - SCROLL HORIZONTAL COM SKEW
// ============================================
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HorizontalScroll({ data }: { data: any[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!containerRef.current || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      let scrollWidth = containerRef.current!.offsetWidth;
      let amountToScroll = scrollWidth - window.innerWidth;

      if (amountToScroll > 0) {
        gsap.to(containerRef.current, {
          x: -amountToScroll,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: \`+=\${amountToScroll * 1.5}\`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressBarRef.current) {
                gsap.to(progressBarRef.current, { scaleX: self.progress, duration: 0.1 });
              }
            }
          },
        });

        // Skew effect based on velocity
        let proxy = { skew: 0 },
          skewSetter = gsap.quickSetter(".playground-card", "skewX", "deg"),
          clamp = gsap.utils.clamp(-15, 15);

        ScrollTrigger.create({
          onUpdate: (self: any) => {
            let skew = clamp(self.getVelocity() / -400);
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
              proxy.skew = skew;
              gsap.to(proxy, {
                skew: 0, duration: 0.8, ease: "power3",
                overwrite: true,
                onUpdate: () => skewSetter(proxy.skew)
              });
            }
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef}>
      <div ref={containerRef} style={{ display: "flex", gap: "40px" }}>
        {data.map((item, idx) => (
          <div key={idx} className="playground-card"
            style={{ minWidth: "400px", padding: "40px" }}>
            <h3 style={{ fontSize: "2.5rem" }}>{item.title}</h3>
            <p style={{ opacity: 0.7 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}`
  },

  // =============================================
  // CATEGORIA: BACKGROUNDS (do novosite)
  // =============================================
  {
    id: "mist-background",
    name: "Mist Background",
    description: "Canvas fullscreen com shaders GLSL (WebGL) que geram névoa fluida em tons verdes. Reage ao mouse e ao scroll. Efeito cinematográfico de profundidade.",
    category: "Backgrounds",
    code: `// ============================================
// MIST BACKGROUND - NÉVOA WEBGL
// ============================================
"use client";

import React, { useEffect, useRef, useState } from 'react';

// Technology: WebGL 2D Fragment Shaders (GLSL)
// Style: Ethereal Generative Fluid / Mist with GREEN tones

const MistBackground: React.FC<{ opacity?: number; scrollControlled?: boolean }> = ({ 
  opacity = 1, scrollControlled = true 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scrollOpacity, setScrollOpacity] = useState(0);

  useEffect(() => {
    if (!scrollControlled) return;
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent < 0.3) setScrollOpacity(0);
      else if (scrollPercent > 0.6) setScrollOpacity(1);
      else setScrollOpacity((scrollPercent - 0.3) / 0.3);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollControlled]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vsSource = \`
      attribute vec2 position;
      void main() { gl_Position = vec4(position, 0.0, 1.0); }
    \`;

    const fsSource = \`
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
      float noise(vec2 p) {
        vec2 i = floor(p); vec2 f = fract(p);
        float a = hash(i); float b = hash(i + vec2(1,0));
        float c = hash(i + vec2(0,1)); float d = hash(i + vec2(1,1));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      float fbm(vec2 p) {
        float v = 0.0; float a = 0.5;
        for (int i = 0; i < 6; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        uv.x *= u_resolution.x / u_resolution.y;
        vec2 q = vec2(fbm(uv + 0.05 * u_time), fbm(uv + vec2(1,1)));
        vec2 r = vec2(fbm(uv + q + vec2(1.7,9.2) + 0.12 * u_time),
                      fbm(uv + q + vec2(8.3,2.8) + 0.1 * u_time));
        float f = fbm(uv + r);

        vec3 color = mix(vec3(0.02,0.05,0.03), vec3(0.05,0.15,0.08), f);
        color = mix(color, vec3(0.1,0.35,0.15), dot(q, r) * 0.6);
        color = pow(color, vec3(1.0, 0.95, 1.05)) * 1.3;
        gl_FragColor = vec4(color, 1.0);
      }
    \`;

    // ... WebGL setup: compile shaders, create program, render loop
    // See full source in components/MistBackground.tsx
  }, [scrollOpacity]);

  const finalOpacity = scrollControlled ? scrollOpacity : opacity;

  return (
    <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ background: '#050a05', zIndex: -1, opacity: finalOpacity, transition: 'opacity 0.5s' }}
    />
  );
};

export default MistBackground;`
  },

  // =============================================
  // CATEGORIA: CAROUSEL & GALLERY (do novosite)
  // =============================================
  {
    id: "hero-carousel",
    name: "Hero Carousel",
    description: "Carousel hero com 4 efeitos de transição (fade, slide, zoom, fadeZoom), auto-advance e indicadores. Responsivo e dinâmico.",
    category: "Carousel & Gallery",
    code: `// ============================================
// HERO CAROUSEL - CAROUSEL COM MÚLTIPLOS EFEITOS
// ============================================
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CarouselSettings {
  displayTime?: number;
  transitionDuration?: number;
  transitionEffect?: string; // "fade" | "slide" | "zoom" | "fadeZoom"
  movementIntensity?: number;
}

export default function HeroCarousel({ images, settings = {} }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const displayTime = settings.displayTime || 4000;
  const transitionDuration = settings.transitionDuration || 0.6;
  const transitionEffect = settings.transitionEffect || "fade";
  const movementIntensity = settings.movementIntensity || 15;

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, displayTime);
    return () => clearInterval(timer);
  }, [images, displayTime]);

  const moveDirection = currentIndex % 2 === 0 ? movementIntensity : -movementIntensity;

  const getAnimationProps = () => {
    switch (transitionEffect) {
      case "slide": return {
        initial: { opacity: 0, x: 100 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -100 },
      };
      case "zoom": return {
        initial: { opacity: 0, scale: 1.2 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
      };
      default: return {
        initial: { opacity: 0, scale: 1.08, x: -moveDirection },
        animate: { opacity: 1, scale: 1, x: moveDirection },
        exit: { opacity: 0, scale: 1.02 },
      };
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} {...getAnimationProps()}
          transition={{ duration: transitionDuration }}
          style={{ position: "absolute", inset: 0 }}>
          <img src={images[currentIndex]} alt={\`Slide \${currentIndex + 1}\`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </motion.div>
      </AnimatePresence>
      <div style={{ position: "absolute", bottom: 20, right: 20, display: "flex", gap: 8, zIndex: 20 }}>
        {images.map((_, idx) => (
          <div key={idx} style={{
            width: 8, height: 8, borderRadius: "50%",
            backgroundColor: idx === currentIndex ? "#fff" : "rgba(255,255,255,0.3)"
          }} />
        ))}
      </div>
    </div>
  );
}`
  },
  {
    id: "process-timeline",
    name: "Process Timeline",
    description: "Seção 'Como Funciona' com SVG circle progress controlado por scroll. Cards de detalhes, pilares e estatísticas. Usa Framer Motion useScroll.",
    category: "Carousel & Gallery",
    code: `// ============================================
// PROCESS TIMELINE - TIMELINE COM PROGRESSO
// ============================================
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

function CircleProgress({ progress }: { progress: MotionValue<number> }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = useTransform(progress, [0, 1], [circumference, 0]);

  return (
    <svg width="120" height="120" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill="none"
        stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
      <motion.circle cx="50" cy="50" r="45" fill="none"
        stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"
        strokeDasharray={circumference}
        style={{ strokeDashoffset, rotate: "-90deg", transformOrigin: "center" }} />
    </svg>
  );
}

function DetailCard({ number, title, description }) {
  return (
    <div style={{ padding: "2rem", borderLeft: "2px solid rgba(0,0,0,0.1)" }}>
      <span style={{ fontSize: "0.7rem", opacity: 0.4 }}>{number}</span>
      <h4 style={{ fontSize: "1.2rem", margin: "0.5rem 0" }}>{title}</h4>
      <p style={{ fontSize: "0.85rem", opacity: 0.6, lineHeight: 1.6 }}>{description}</p>
    </div>
  );
}

export default function ProcessTimeline() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const step1 = useTransform(scrollYProgress, [0, 0.33], [0, 1]);
  const step2 = useTransform(scrollYProgress, [0.33, 0.66], [0, 1]);
  const step3 = useTransform(scrollYProgress, [0.66, 1], [0, 1]);

  return (
    <section ref={containerRef} style={{ padding: "20vh 40px", minHeight: "200vh" }}>
      <h2 style={{ fontSize: "3rem", marginBottom: "4rem" }}>Como Funciona</h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4rem" }}>
        <div>
          <CircleProgress progress={step1} />
          <DetailCard number="01" title="Consulta Inicial" description="Avaliação completa" />
        </div>
        <div>
          <CircleProgress progress={step2} />
          <DetailCard number="02" title="Plano Personalizado" description="Tratamento sob medida" />
        </div>
        <div>
          <CircleProgress progress={step3} />
          <DetailCard number="03" title="Acompanhamento" description="Resultados contínuos" />
        </div>
      </div>
    </section>
  );
}`
  },
  // =============================================
  // CATEGORIA: BRANDING
  // =============================================
  {
    id: "nutribuddy-logo",
    name: "NutriBuddy Logo",
    description: "Logomarca oficial NutriBuddy em SVG inline. Usa currentColor para permitir qualquer cor via CSS. Preview interativo com color picker, fundo transparente/sólido, tamanho ajustável e toggle de sombra.",
    category: "Branding",
    code: `// ============================================
// NUTRIBUDDY LOGO - SVG INLINE ESTÁTICA
// ============================================
// Fonte: github.com/drpauloguimaraesjr/Nutri-Buddy
// viewBox: 0 0 99 99 | fill: currentColor

interface NutriBuddyLogoProps {
  className?: string;
  size?: number;
  color?: string;
}

const logoPath = "M98.9485 98.2746C98.9485 98.6491 98.6491 98.9486 98.2746 98.9486H0.673964C0.299499 98.9486 0 98.6491 0 98.2746V0.67401C0 0.299545 0.299499 0 0.673964 0H98.2746C98.6491 0 98.9485 0.299545 98.9485 0.67401V98.2746ZM20.4456 86.5464L30.8559 93.4365C31.3951 93.796 32.0242 93.9907 32.6682 93.9907H93.4215C93.8709 93.9907 94.2303 93.6312 94.2303 93.1819V5.58699C94.2303 5.00282 93.766 4.53851 93.1968 4.53851L44.8309 4.68831C44.3366 4.68831 43.9771 5.15265 44.0969 5.63197C44.1119 5.69188 44.3217 5.82667 44.7261 6.03637C45.0257 6.20114 45.3102 6.62055 45.5648 7.30957C48.4706 15.0086 45.1005 18.2739 38.3152 22.1234C33.2375 25.0142 28.9985 27.3959 25.6134 29.2682C24.8944 29.6726 24.8644 30.6911 25.5684 31.1105C31.3352 34.6006 36.2631 37.8659 40.3373 40.9365C44.2467 43.8873 45.3851 47.9165 43.7225 53.0242C43.363 54.1327 41.6554 56.0949 40.9514 57.4429C40.6968 57.9372 40.8166 58.5514 41.2659 58.8959C44.007 61.0528 45.0855 64.0036 44.4864 67.7632C44.082 70.2646 42.2695 72.4964 39.0491 74.4436C34.0463 77.4693 28.3394 80.6298 20.4756 85.423C20.0562 85.6776 20.0412 86.2767 20.4456 86.5464ZM23.6961 4.68831H5.76673C5.30239 4.68831 4.91284 5.07772 4.91284 5.54206V93.2418C4.91284 93.6612 5.24237 93.9907 5.66177 93.9907H10.6048C11.0541 93.9907 11.3986 93.5713 11.3087 93.1369C10.9792 91.4743 11.2787 89.3773 12.1924 86.8459C12.3572 86.4115 12.4321 85.9472 12.4471 85.4978C12.4621 85.0185 12.0726 83.0413 11.2787 79.5513C10.0505 74.1291 12.3573 70.4743 16.8359 66.9693C21.1648 63.5692 25.5683 60.6633 30.017 58.2518C30.6161 57.9222 30.6611 57.0834 30.092 56.709L17.6596 48.4707C17.4949 48.3659 17.3602 48.2311 17.2404 48.0963C12.2226 41.9101 11.8481 36.1883 16.102 30.9009C16.5514 30.3317 16.5962 29.5528 16.2068 28.9387C11.878 22.2432 11.833 15.398 17.9143 10.2753C19.7118 8.76246 21.734 7.1897 23.9808 5.58699C24.3702 5.3024 24.1754 4.68831 23.6961 4.68831Z";

export function NutriBuddyLogo({
  className = "",
  size = 80,
  color,
}: NutriBuddyLogoProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 99 99"
      role="img"
      aria-label="NutriBuddy logo"
    >
      <title>NutriBuddy</title>
      <path d={logoPath} fill={color || "currentColor"} />
    </svg>
  );
}

// Uso:
// <NutriBuddyLogo size={120} color="#1a1a18" />
// <NutriBuddyLogo size={64} className="text-white" />`
  }
];

export const categories = Array.from(new Set(effects.map(e => e.category)));
