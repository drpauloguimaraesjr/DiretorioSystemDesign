/**
 * Design System - Foundation Tokens
 * Cores extraídas do Tailwind config e globals.css
 */

export const colors = {
    // Base colors
    background: "hsl(var(--background))",
    foreground: "hsl(var(--foreground))",

    // Card
    card: "hsl(var(--card))",
    cardForeground: "hsl(var(--card-foreground))",

    // Muted
    muted: "hsl(var(--muted))",
    mutedForeground: "hsl(var(--muted-foreground))",

    // Border
    border: "hsl(var(--border))",

    // Accent
    accent: "hsl(var(--accent))",
    accentForeground: "hsl(var(--accent-foreground))",

    // Primary
    primary: "hsl(var(--primary))",
    primaryForeground: "hsl(var(--primary-foreground))",

    // Secondary
    secondary: "hsl(var(--secondary))",
    secondaryForeground: "hsl(var(--secondary-foreground))",

    // Destructive
    destructive: "hsl(var(--destructive))",
    destructiveForeground: "hsl(var(--destructive-foreground))",

    // Input & Ring
    input: "hsl(var(--input))",
    ring: "hsl(var(--ring))",

    // Charts
    chart: {
        1: "hsl(var(--chart-1))",
        2: "hsl(var(--chart-2))",
        3: "hsl(var(--chart-3))",
        4: "hsl(var(--chart-4))",
        5: "hsl(var(--chart-5))",
    },
} as const

export type ColorToken = keyof typeof colors
