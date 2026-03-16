import LogoBuilder from "@/components/LogoBuilder";

export default function LogoBuilderPage() {
    return (
        <main className="min-h-screen bg-black text-white p-6 md:p-12 relative overflow-hidden flex flex-col justify-center">
            {/* Background elements to make the dark mode premium (avoiding bento grids or generic splits) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none origin-center opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-900/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-emerald-900/10 blur-[100px]" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-6xl space-y-8">
                <header className="space-y-2 text-center md:text-left mb-12">
                     <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter antialiased">
                        Logo<span className="text-neutral-500">Forge</span>
                     </h1>
                     <p className="text-neutral-400 max-w-lg md:text-lg">
                        Customize sua logomarca dinamicamente. Exporte em vetores e copie o código base em React.
                     </p>
                </header>
                
                <section>
                    <LogoBuilder />
                </section>
            </div>
        </main>
    )
}
