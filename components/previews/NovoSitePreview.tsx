'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { AnimatedLogo } from '@/components/AnimatedLogo';

// ============================================
// MAGNETIC PREVIEW
// ============================================
export function MagneticPreview() {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        const intensity = 0.3;
        setPosition({ x: middleX * intensity, y: middleY * intensity });
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-neutral-50 to-neutral-100">
            <p className="text-xs text-muted-foreground font-mono">PASSE O MOUSE SOBRE O BOTÃO</p>
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setPosition({ x: 0, y: 0 })}
                animate={{ x: position.x, y: position.y }}
                transition={{ type: "spring", stiffness: 50, damping: 25, mass: 0.5 }}
            >
                <button className="px-8 py-4 bg-foreground text-background rounded-sm text-sm font-medium hover:opacity-90 transition-opacity">
                    MAGNETIC EFFECT →
                </button>
            </motion.div>
            <p className="text-xs text-muted-foreground/50 font-mono mt-4">O botão segue o cursor com spring suave</p>
        </div>
    );
}

// ============================================
// TYPING ANIMATION PREVIEW
// ============================================
export function TypingAnimationPreview() {
    const [displayedText, setDisplayedText] = useState("");
    const [key, setKey] = useState(0);
    const text = "Transforme sua saúde com ciência aplicada e tecnologia de ponta.";

    useEffect(() => {
        setDisplayedText("");
        let currentIndex = 0;
        const typeInterval = setInterval(() => {
            if (currentIndex < text.length) {
                setDisplayedText(text.slice(0, currentIndex + 1));
                currentIndex++;
            } else {
                clearInterval(typeInterval);
                setTimeout(() => setKey(k => k + 1), 3000);
            }
        }, 40);
        return () => clearInterval(typeInterval);
    }, [key]);

    return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 p-10">
            <div className="max-w-lg">
                <span className="font-serif text-2xl leading-relaxed">
                    {displayedText}
                    <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="text-foreground/60"
                    >|</motion.span>
                </span>
            </div>
        </div>
    );
}

// ============================================
// FLOATING CARDS PREVIEW
// ============================================
export function FloatingCardsPreview() {
    const [hovered, setHovered] = useState<number | null>(null);

    const cards = [
        { title: "Design System", cat: "UI/UX", color: "#1a1a2e" },
        { title: "Animations", cat: "Motion", color: "#16213e" },
        { title: "Components", cat: "React", color: "#0f3460" },
    ];

    return (
        <div className="w-full h-full flex items-center justify-center gap-4 bg-gradient-to-br from-neutral-50 to-neutral-100 p-6">
            {cards.map((card, i) => {
                const cardRef = useRef<HTMLDivElement>(null);
                const x = useMotionValue(0);
                const y = useMotionValue(0);
                const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 });
                const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 });

                return (
                    <motion.div
                        key={i}
                        ref={cardRef}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.15, duration: 0.6 }}
                        onMouseMove={(e) => {
                            if (!cardRef.current) return;
                            const rect = cardRef.current.getBoundingClientRect();
                            x.set((e.clientX - rect.left - rect.width / 2) / rect.width);
                            y.set((e.clientY - rect.top - rect.height / 2) / rect.height);
                        }}
                        onMouseLeave={() => { x.set(0); y.set(0); setHovered(null); }}
                        onMouseEnter={() => setHovered(i)}
                        style={{ perspective: "800px", cursor: "pointer" }}
                        className="flex-1"
                    >
                        <motion.div
                            animate={{ scale: hovered === i ? 1.05 : 1 }}
                            style={{
                                borderRadius: "12px",
                                overflow: "hidden",
                                height: "200px",
                                backgroundColor: card.color,
                                transformStyle: "preserve-3d",
                                rotateX, rotateY,
                                position: "relative"
                            }}
                        >
                            <div style={{
                                position: "absolute", bottom: 0, left: 0, right: 0,
                                padding: "16px",
                                background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                                color: "#fff"
                            }}>
                                <span style={{ fontSize: "0.55rem", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.1em" }}>{card.cat}</span>
                                <h4 style={{ fontSize: "0.95rem", marginTop: "4px", fontWeight: 500 }}>{card.title}</h4>
                            </div>
                        </motion.div>
                    </motion.div>
                );
            })}
        </div>
    );
}

// ============================================
// TEXT MASK REVEAL PREVIEW
// ============================================
export function TextMaskRevealPreview() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const lines = ["Transforme", "sua saúde", "com ciência"];

    return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100">
            <div className="space-y-2">
                {lines.map((line, i) => (
                    <div key={i} style={{ overflow: "hidden" }}>
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={visible ? { y: "0%" } : {}}
                            transition={{ duration: 0.8, delay: i * 0.15, ease: [0.33, 1, 0.68, 1] }}
                        >
                            <span className="font-serif text-4xl font-semibold block">{line}</span>
                        </motion.div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================
// MARQUEE PREVIEW
// ============================================
export function MarqueePreview() {
    const text = "NEXT GENERATION DIGITAL EXPERIENCES";
    return (
        <div className="w-full h-full flex items-center bg-gradient-to-br from-neutral-50 to-neutral-100 overflow-hidden">
            <div className="whitespace-nowrap" style={{ display: "inline-flex" }}>
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="flex"
                >
                    {[...Array(8)].map((_, i) => (
                        <span key={i} className="font-serif text-5xl font-semibold opacity-10 px-8">
                            {text} <span className="text-muted-foreground">/</span>
                        </span>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

// ============================================
// LIVE CLOCK PREVIEW
// ============================================
export function LiveClockPreview() {
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`);
            setDate(now.toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-neutral-50 to-neutral-100">
            <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">[ LOCAL TIME ]</span>
            <span className="font-mono text-6xl font-light tracking-wider">{time}</span>
            <span className="text-sm text-muted-foreground capitalize">{date}</span>
        </div>
    );
}

// ============================================
// PAGE TRANSITION PREVIEW
// ============================================
export function PageTransitionPreview() {
    const [page, setPage] = useState(0);
    const pages = [
        { title: "Home", bg: "from-blue-50 to-indigo-50" },
        { title: "Sobre", bg: "from-emerald-50 to-teal-50" },
        { title: "Contato", bg: "from-amber-50 to-orange-50" },
    ];

    return (
        <div className="w-full h-full flex flex-col bg-neutral-50">
            <div className="flex gap-2 p-3 border-b border-border">
                {pages.map((p, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`px-3 py-1 text-xs rounded-sm font-mono transition-colors ${page === i ? 'bg-foreground text-background' : 'hover:bg-muted'}`}
                    >
                        {p.title}
                    </button>
                ))}
            </div>
            <div className="flex-1 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={page}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                        className={`absolute inset-0 bg-gradient-to-br ${pages[page].bg} flex items-center justify-center`}
                    >
                        <h2 className="font-serif text-4xl">{pages[page].title}</h2>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

// ============================================
// PRELOADER PREVIEW
// ============================================
export function PreloaderPreview() {
    const [percentage, setPercentage] = useState(0);
    const [key, setKey] = useState(0);

    useEffect(() => {
        setPercentage(0);
        const interval = setInterval(() => {
            setPercentage(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setKey(k => k + 1), 2000);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);
        return () => clearInterval(interval);
    }, [key]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-6" style={{ backgroundColor: "#F8F6F2" }}>
            <AnimatedLogo size={120} speed={2} />
            <div className="text-center">
                <span className="font-mono text-xs tracking-widest opacity-30">LOADING EXPERIENCE...</span>
                <motion.div
                    className="mt-3 h-px bg-foreground/20 rounded-full overflow-hidden"
                    style={{ width: 120 }}
                >
                    <motion.div
                        className="h-full bg-foreground"
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.1 }}
                    />
                </motion.div>
                <span className="font-mono text-xs opacity-40 mt-1 block">{percentage}%</span>
            </div>
        </div>
    );
}

// ============================================
// SMOOTH SCROLL PREVIEW
// ============================================
export function SmoothScrollPreview() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-neutral-50 to-neutral-100">
            <div className="text-center space-y-4">
                <span className="font-mono text-xs tracking-widest text-muted-foreground">[ SMOOTH SCROLL ]</span>
                <h3 className="font-serif text-2xl">Lenis + GSAP ScrollTrigger</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Wrapper global que aplica scroll suave &quot;pesado&quot; e luxuoso a toda a página, sincronizado com GSAP.
                </p>
                <div className="flex gap-3 justify-center text-xs font-mono text-muted-foreground/60">
                    <span>duration: 1.8</span>
                    <span>•</span>
                    <span>lerp: 0.1</span>
                    <span>•</span>
                    <span>wheel: 0.8x</span>
                </div>
            </div>
        </div>
    );
}

// ============================================
// HORIZONTAL SCROLL PREVIEW
// ============================================
export function HorizontalScrollPreview() {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        let frame: number;
        const animate = () => {
            setOffset(prev => (prev + 0.3) % 200);
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, []);

    const cards = ["Design", "Motion", "Code", "Deploy", "Scale"];

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-neutral-50 to-neutral-100 overflow-hidden">
            <span className="font-mono text-xs tracking-widest text-muted-foreground">[ HORIZONTAL SCROLL + SKEW ]</span>
            <div className="flex gap-4" style={{ transform: `translateX(-${offset}px)` }}>
                {[...cards, ...cards].map((card, i) => (
                    <div key={i} style={{
                        minWidth: 140, padding: "20px",
                        backgroundColor: "#1a1a18", color: "#f7f6f3",
                        borderRadius: 8,
                        transform: `skewX(${Math.sin(offset * 0.02 + i) * 3}deg)`,
                        transition: "transform 0.3s"
                    }}>
                        <span className="font-mono text-xs opacity-50">[{String(i + 1).padStart(2, '0')}]</span>
                        <h4 className="text-sm font-medium mt-2">{card}</h4>
                    </div>
                ))}
            </div>
            <div className="h-1 w-32 bg-border rounded-full overflow-hidden">
                <motion.div className="h-full bg-foreground" style={{ width: `${(offset / 200) * 100}%` }} />
            </div>
        </div>
    );
}

// ============================================
// MIST BACKGROUND PREVIEW
// ============================================
export function MistBackgroundPreview() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 400;
        canvas.height = 400;
        let frame: number;
        let t = 0;

        const draw = () => {
            t += 0.005;
            const imageData = ctx.createImageData(canvas.width, canvas.height);
            for (let y = 0; y < canvas.height; y += 2) {
                for (let x = 0; x < canvas.width; x += 2) {
                    const nx = x / canvas.width;
                    const ny = y / canvas.height;
                    const v1 = Math.sin(nx * 6 + t * 2) * Math.cos(ny * 4 + t);
                    const v2 = Math.cos(nx * 3 - t) * Math.sin(ny * 7 + t * 1.5);
                    const v = (v1 + v2) * 0.5 + 0.5;
                    const r = Math.floor(v * 15);
                    const g = Math.floor(v * 50 + 10);
                    const b = Math.floor(v * 20);
                    for (let dy = 0; dy < 2; dy++) {
                        for (let dx = 0; dx < 2; dx++) {
                            const idx = ((y + dy) * canvas.width + (x + dx)) * 4;
                            imageData.data[idx] = r;
                            imageData.data[idx + 1] = g;
                            imageData.data[idx + 2] = b;
                            imageData.data[idx + 3] = 255;
                        }
                    }
                }
            }
            ctx.putImageData(imageData, 0, 0);
            frame = requestAnimationFrame(draw);
        };
        frame = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <div className="w-full h-full relative overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80">
                <span className="font-mono text-xs tracking-widest opacity-50">[ WEBGL MIST ]</span>
                <h3 className="font-serif text-2xl mt-2">Generative Fluid Shader</h3>
                <p className="text-xs opacity-40 mt-2">GLSL Fragment Shaders • Green Palette</p>
            </div>
        </div>
    );
}

// ============================================
// HERO CAROUSEL PREVIEW
// ============================================
export function HeroCarouselPreview() {
    const [current, setCurrent] = useState(0);
    const colors = ["#1a1a2e", "#16213e", "#0f3460", "#e94560"];
    const labels = ["Fade Transition", "Slide Effect", "Zoom In", "FadeZoom"];

    useEffect(() => {
        const timer = setInterval(() => setCurrent(c => (c + 1) % colors.length), 2500);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full h-full relative overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundColor: colors[current] }}
                >
                    <div className="text-center text-white">
                        <span className="font-mono text-xs tracking-widest opacity-50">{`[ SLIDE ${current + 1}/${colors.length} ]`}</span>
                        <h3 className="font-serif text-3xl mt-3">{labels[current]}</h3>
                    </div>
                </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                {colors.map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full transition-colors" style={{
                        backgroundColor: i === current ? '#fff' : 'rgba(255,255,255,0.3)'
                    }} />
                ))}
            </div>
        </div>
    );
}

// ============================================
// PROCESS TIMELINE PREVIEW
// ============================================
export function ProcessTimelinePreview() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let frame: number;
        const animate = () => {
            setProgress(prev => (prev + 0.003) % 1);
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, []);

    const steps = [
        { num: "01", title: "Consulta", p: Math.min(progress * 3, 1) },
        { num: "02", title: "Plano", p: Math.max(0, Math.min((progress - 0.33) * 3, 1)) },
        { num: "03", title: "Resultado", p: Math.max(0, Math.min((progress - 0.66) * 3, 1)) },
    ];

    const circumference = 2 * Math.PI * 35;

    return (
        <div className="w-full h-full flex items-center justify-center gap-8 bg-gradient-to-br from-neutral-50 to-neutral-100 p-6">
            {steps.map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                    <svg width="80" height="80" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="2" />
                        <circle cx="40" cy="40" r="35" fill="none" stroke="#1a1a18" strokeWidth="2"
                            strokeLinecap="round" strokeDasharray={circumference}
                            strokeDashoffset={circumference - step.p * circumference}
                            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }} />
                        <text x="40" y="44" textAnchor="middle" fontSize="12" fontFamily="monospace" fill="#1a1a18">
                            {step.num}
                        </text>
                    </svg>
                    <span className="text-xs font-medium">{step.title}</span>
                </div>
            ))}
        </div>
    );
}

// Default export
export default MagneticPreview;
