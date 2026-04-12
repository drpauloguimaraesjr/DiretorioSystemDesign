'use client';

import { useState, Suspense, lazy, ComponentType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { effects, categories } from '@/data/effects';
import CodeDisplay from '@/components/CodeDisplay';

const previewComponents: Record<string, React.LazyExoticComponent<ComponentType<object>>> = {
  'liquid-distortion': lazy(() => import('@/components/previews/LiquidDistortionPreview')),
  'distorted-text': lazy(() => import('@/components/previews/LiquidDistortionPreview')),
  'text-scramble': lazy(() => import('@/components/previews/TextScramblePreview')),
  'scramble-link': lazy(() => import('@/components/previews/TextScramblePreview')),
  'scroll-to-explore': lazy(() => import('@/components/previews/ScrollToExplorePreview')),
  'scene-3d': lazy(() => import('@/components/previews/Scene3DPreview')),
  'main-page': lazy(() => import('@/components/previews/MainPagePreview')),
  'reveal-text': lazy(() => import('@/components/previews/RevealTextPreview')),
  'reveal-letter': lazy(() => import('@/components/previews/RevealTextPreview')),
  // New UI Components
  'animated-logo-data': lazy(() => import('@/components/previews/UIComponentsPreview').then(m => ({ default: m.AnimatedLogoDataPreview }))),
  'animate-tabs': lazy(() => import('@/components/previews/UIComponentsPreview').then(m => ({ default: m.AnimateTabsPreview }))),
  'share-button': lazy(() => import('@/components/previews/UIComponentsPreview').then(m => ({ default: m.ShareButtonPreview }))),
  'theme-toggler': lazy(() => import('@/components/previews/UIComponentsPreview').then(m => ({ default: m.ThemeTogglerPreview }))),
  'headless-popover': lazy(() => import('@/components/previews/UIComponentsPreview').then(m => ({ default: m.HeadlessPopoverPreview }))),
  // NovoSite Effects
  'magnetic': lazy(() => import('@/components/previews/NovoSitePreview').then(m => ({ default: m.MagneticPreview }))),
  'typing-animation': lazy(() => import('@/components/previews/NovoSitePreview').then(m => ({ default: m.TypingAnimationPreview }))),
  'floating-cards': lazy(() => import('@/components/previews/NovoSitePreview').then(m => ({ default: m.FloatingCardsPreview }))),
  'text-mask-reveal': lazy(() => import('@/components/previews/NovoSitePreview').then(m => ({ default: m.TextMaskRevealPreview }))),
  'marquee': lazy(() => import('@/components/previews/NovoSitePreview').then(m => ({ default: m.MarqueePreview }))),
  'live-clock': lazy(() => import('@/components/previews/NovoSitePreview').then(m => ({ default: m.LiveClockPreview }))),
  'preloader': lazy(() => import('@/components/previews/NovoSitePreview').then(m => ({ default: m.PreloaderPreview }))),
  'page-transition': lazy(() => import('@/components/previews/NovoSitePreview').then(m => ({ default: m.PageTransitionPreview }))),
  'smooth-scroll': lazy(() => import('@/components/previews/NovoSitePreview').then(m => ({ default: m.SmoothScrollPreview }))),
  'horizontal-scroll': lazy(() => import('@/components/previews/NovoSitePreview').then(m => ({ default: m.HorizontalScrollPreview }))),
  'mist-background': lazy(() => import('@/components/previews/NovoSitePreview').then(m => ({ default: m.MistBackgroundPreview }))),
  'hero-carousel': lazy(() => import('@/components/previews/NovoSitePreview').then(m => ({ default: m.HeroCarouselPreview }))),
  'process-timeline': lazy(() => import('@/components/previews/NovoSitePreview').then(m => ({ default: m.ProcessTimelinePreview }))),
  // Branding
  'nutribuddy-logo': lazy(() => import('@/components/LogoBuilder')),
};

const systemPreviewComponents: Record<string, React.LazyExoticComponent<ComponentType<object>>> = {
  'system-layout': lazy(() => import('@/components/previews/SystemPreview').then(m => ({ default: m.LayoutPreview }))),
  'system-code-display': lazy(() => import('@/components/previews/SystemPreview').then(m => ({ default: m.CodeDisplayPreview }))),
  'system-globals': lazy(() => import('@/components/previews/SystemPreview').then(m => ({ default: m.GlobalStylesPreview }))),
};

const allPreviews = { ...previewComponents, ...systemPreviewComponents };

export default function Home() {
  const [selectedEffect, setSelectedEffect] = useState(effects[0]);
  const PreviewComponent = allPreviews[selectedEffect.id];

  return (
    <div className="min-h-screen bg-background flex">
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
              <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3 px-2">
                {category}
              </h2>
              <ul className="space-y-1">
                {effects
                  .filter((e) => e.category === category)
                  .map((effect) => {
                    const globalIndex = effects.findIndex((e) => e.id === effect.id) + 1;
                    const isSelected = selectedEffect.id === effect.id;
                    return (
                      <li key={effect.id}>
                        <button
                          onClick={() => setSelectedEffect(effect)}
                          className={`w-full text-left px-3 py-2.5 rounded-sm transition-all duration-200 group flex items-start gap-3 ${isSelected
                            ? 'bg-foreground text-background'
                            : 'hover:bg-muted'
                            }`}
                        >
                          <span className={`font-serif text-lg leading-none mt-0.5 ${isSelected ? 'text-background/60' : 'text-muted-foreground'
                            }`}>
                            {String(globalIndex).padStart(2, '0')}
                          </span>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium block truncate">
                              {effect.name}
                            </span>
                          </div>
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center font-mono">
            {effects.length} efeitos disponíveis
          </p>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen">
        <header className="p-6 border-b border-border flex items-end justify-between">
          <div>
            <motion.span
              key={selectedEffect.id + '-index'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-5xl text-muted-foreground/30 block leading-none"
            >
              {String(effects.findIndex((e) => e.id === selectedEffect.id) + 1).padStart(2, '0')}
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
            className="text-xs font-mono uppercase tracking-widest text-muted-foreground"
          >
            {selectedEffect.category}
          </motion.span>
        </header>

        <div className="flex-1 p-6 flex flex-col gap-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.p
              key={selectedEffect.id + '-desc'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-muted-foreground max-w-2xl"
            >
              {selectedEffect.description}
            </motion.p>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedEffect.id + '-preview'}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="border border-border rounded-sm overflow-hidden bg-card"
              style={{ minHeight: '400px' }}
            >
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center bg-muted/20">
                    <div className="w-5 h-5 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
                  </div>
                }
              >
                {PreviewComponent && <PreviewComponent />}
              </Suspense>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedEffect.id + '-code'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <CodeDisplay
                code={selectedEffect.code}
                title={`${selectedEffect.name.toLowerCase().replace(/\s+/g, '-')}.tsx`}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
