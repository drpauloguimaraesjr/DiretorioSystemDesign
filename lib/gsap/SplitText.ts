/**
 * GSAP SplitText Mock
 * 
 * NOTA: O plugin SplitText do GSAP é um plugin PREMIUM pago.
 * Esta é uma implementação básica para não quebrar o build.
 * Para funcionalidade completa, é necessário adquirir a licença GSAP Club.
 * 
 * @see https://gsap.com/pricing/
 */

interface SplitTextOptions {
    type?: string;
    charsClass?: string;
    wordsClass?: string;
    linesClass?: string;
}

export class SplitText {
    chars: HTMLElement[] = [];
    words: HTMLElement[] = [];
    lines: HTMLElement[] = [];

    constructor(element: HTMLElement | string, options: SplitTextOptions = {}) {
        // Mock implementation - não divide o texto realmente
        // Para produção, use o plugin oficial GSAP SplitText
        const el = typeof element === 'string'
            ? document.querySelector(element) as HTMLElement
            : element;

        if (!el) return;

        // Cria elementos mockados para não quebrar o código
        const span = document.createElement('span');
        span.textContent = el.textContent;

        if (options.charsClass) {
            span.className = options.charsClass;
        }

        this.chars = [span];
        this.words = [span];
        this.lines = [span];
    }

    revert() {
        // Noop
    }
}
