# Eva Effects Showcase

Sistema de galeria de efeitos interativos com menu lateral, preview ao vivo e exibição de código.

## Stack

- **Next.js 14** + TypeScript
- **Three.js** + React Three Fiber (shaders WebGL)
- **Framer Motion** (animações)
- **Tailwind CSS 3** (estilos)
- **Lucide React** (ícones)

## Fontes

- **Playfair Display** — Títulos (serif)
- **Inter** — Corpo (sans-serif)
- **JetBrains Mono** — Código (monospace)

## Instalação

```bash
npm install
npm run dev
```

## Estrutura

```
app/
  layout.tsx       → Layout root com fontes
  globals.css      → Estilos globais + scrollbars
  page.tsx         → Página principal com sidebar + preview + código

components/
  CodeDisplay.tsx   → Exibição de código com line numbers e copy
  previews/
    LiquidDistortionPreview.tsx  → Shader metaball WebGL
    TextScramblePreview.tsx      → Scramble de texto
    ScrollToExplorePreview.tsx   → Scroll + scramble
    Scene3DPreview.tsx           → Cena 3D completa
    MainPagePreview.tsx          → Página completa miniatura
    RevealTextPreview.tsx        → Reveal por clip-path
    SystemPreview.tsx            → Previews do sistema (layout, code, estilos)

data/
  effects.ts       → Dados de todos os efeitos + código
```

## Efeitos Incluídos

### Sistema (3)
1. Layout Principal — estrutura sidebar + preview + código
2. Code Display — componente de exibição de código
3. Estilos Globais — fontes, cores, scrollbars

### WebGL Shaders (1)
4. Distorção Líquida — shader metaball com pull/stretch/melt

### React Three Fiber (2)
5. Texto Distorcido WebGL — componente R3F com shader
6. Cena 3D Principal — cena com múltiplos textos

### React Hooks (1)
7. Text Scramble — hook de embaralhamento de texto

### React Components (1)
8. Scramble Link — link com efeito scramble

### Framer Motion (1)
9. Scroll To Explore — fade-in + scramble

### Page Layout (1)
10. Página Principal — composição completa

### CSS Effects (2)
11. Reveal Letter — letra com clip-path dinâmico
12. Reveal Text — texto com revelação progressiva
