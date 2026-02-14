'use client';

export function LayoutPreview() {
  return (
    <div className="w-full h-full bg-[#f5f5f0] rounded-sm overflow-hidden flex">
      {/* Mini sidebar */}
      <div className="w-1/4 border-r border-black/10 flex flex-col p-3">
        <div className="mb-4">
          <div className="font-serif text-sm font-semibold">Eva Effects</div>
          <div className="text-[8px] text-black/50 mt-0.5">Showcase de Animações</div>
        </div>
        <div className="space-y-1">
          <div className="text-[7px] font-mono uppercase tracking-widest text-black/40 mb-1">Sistema</div>
          <div className="bg-black text-white text-[8px] px-2 py-1 rounded-sm flex items-center gap-1.5">
            <span className="text-white/50 font-serif text-[10px]">01</span>
            <span>Layout</span>
          </div>
          <div className="text-[8px] px-2 py-1 flex items-center gap-1.5 text-black/70">
            <span className="text-black/30 font-serif text-[10px]">02</span>
            <span>Code Display</span>
          </div>
          <div className="text-[8px] px-2 py-1 flex items-center gap-1.5 text-black/70">
            <span className="text-black/30 font-serif text-[10px]">03</span>
            <span>Estilos</span>
          </div>
          <div className="text-[7px] font-mono uppercase tracking-widest text-black/40 mt-3 mb-1">WebGL</div>
          <div className="text-[8px] px-2 py-1 flex items-center gap-1.5 text-black/70">
            <span className="text-black/30 font-serif text-[10px]">04</span>
            <span>Distorção</span>
          </div>
        </div>
        <div className="mt-auto pt-2 border-t border-black/10">
          <div className="text-[7px] text-black/40 text-center font-mono">11 efeitos</div>
        </div>
      </div>

      {/* Mini main */}
      <div className="flex-1 flex flex-col">
        <div className="p-3 border-b border-black/10 flex items-end justify-between">
          <div>
            <span className="font-serif text-2xl text-black/15 block leading-none">01</span>
            <span className="font-serif text-sm font-semibold mt-1 block">Layout Principal</span>
          </div>
          <span className="text-[7px] font-mono uppercase tracking-widest text-black/40">Sistema</span>
        </div>
        <div className="flex-1 p-3 space-y-2">
          <div className="text-[8px] text-black/50 max-w-[200px]">
            Estrutura do sistema com sidebar, preview e código.
          </div>
          <div className="border border-black/10 rounded-sm h-20 bg-white/50 flex items-center justify-center">
            <span className="text-[8px] text-black/30 font-mono">Preview Area</span>
          </div>
          <div className="border border-black/10 rounded-sm bg-white/50 p-2">
            <div className="flex items-center justify-between mb-1 pb-1 border-b border-black/5">
              <span className="text-[7px] font-mono text-black/40">layout.tsx</span>
              <span className="text-[7px] text-black/30">Copiar</span>
            </div>
            <div className="flex gap-1">
              <div className="text-[7px] font-mono text-black/20 text-right" style={{ width: '12px' }}>
                1<br/>2<br/>3
              </div>
              <div className="text-[7px] font-mono text-black/60">
                {'export default'}<br/>{'  function Home()'}<br/>{'  return <div>'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CodeDisplayPreview() {
  return (
    <div className="w-full h-full bg-[#f5f5f0] rounded-sm overflow-hidden flex items-center justify-center p-8">
      <div className="w-full max-w-lg border border-black/10 rounded-sm bg-white overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 py-2 border-b border-black/10 bg-black/[0.02]">
          <span className="font-mono text-xs text-black/50">code-display.tsx</span>
          <div className="flex items-center gap-1.5 text-xs text-black/40">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
            <span>Copiar</span>
          </div>
        </div>
        <div className="flex">
          <div className="py-3 px-3 text-right border-r border-black/10 bg-black/[0.01] select-none">
            {[1,2,3,4,5,6,7,8].map(n => (
              <div key={n} className="font-mono text-[10px] text-black/20 leading-5">{n}</div>
            ))}
          </div>
          <pre className="py-3 px-4">
            <code className="font-mono text-[10px] leading-5 text-black/70 whitespace-pre">{`interface CodeDisplayProps {
  code: string;
  title?: string;
}

export default function CodeDisplay({
  code, title
}: CodeDisplayProps) {`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export function GlobalStylesPreview() {
  return (
    <div className="w-full h-full bg-[#f5f5f0] rounded-sm overflow-hidden p-8 flex flex-col items-center justify-center gap-6">
      {/* Font showcase */}
      <div className="text-center space-y-3 w-full max-w-md">
        <div>
          <p className="text-[9px] font-mono uppercase tracking-widest text-black/40 mb-1">Playfair Display — Títulos</p>
          <p className="font-serif text-3xl font-semibold text-black">Eva Effects</p>
        </div>
        <div>
          <p className="text-[9px] font-mono uppercase tracking-widest text-black/40 mb-1">Inter — Corpo</p>
          <p className="text-sm text-black/70">Showcase de efeitos interativos com WebGL, Three.js e Framer Motion.</p>
        </div>
        <div>
          <p className="text-[9px] font-mono uppercase tracking-widest text-black/40 mb-1">JetBrains Mono — Código</p>
          <p className="font-mono text-xs text-black/60">const shader = fragmentShader();</p>
        </div>
      </div>

      {/* Color palette */}
      <div className="flex gap-2 items-end">
        <div className="text-center">
          <div className="w-10 h-10 rounded-sm bg-[#f7f6f3] border border-black/10"></div>
          <p className="text-[7px] font-mono text-black/40 mt-1">bg</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 rounded-sm bg-[#1a1a18]"></div>
          <p className="text-[7px] font-mono text-black/40 mt-1">fg</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 rounded-sm bg-white border border-black/10"></div>
          <p className="text-[7px] font-mono text-black/40 mt-1">card</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 rounded-sm bg-[#edece8]"></div>
          <p className="text-[7px] font-mono text-black/40 mt-1">muted</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 rounded-sm bg-[#78776e]"></div>
          <p className="text-[7px] font-mono text-black/40 mt-1">muted-fg</p>
        </div>
        <div className="text-center">
          <div className="w-10 h-10 rounded-sm bg-[#e0dfd8]"></div>
          <p className="text-[7px] font-mono text-black/40 mt-1">border</p>
        </div>
      </div>
    </div>
  );
}
