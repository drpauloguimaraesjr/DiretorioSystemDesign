'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Share2, Sun, Moon, Monitor } from 'lucide-react';
import { AnimatedLogo } from '@/components/AnimatedLogo';

// ============================================
// ANIMATED LOGO DNA PREVIEW
// ============================================
export function AnimatedLogoDNAPreview() {
    return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100">
            <AnimatedLogo size={150} />
        </div>
    );
}

// ============================================
// ANIMATE TABS PREVIEW
// ============================================
export function AnimateTabsPreview() {
    return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 p-6">
            <div className="w-full max-w-sm">
                <Tabs defaultValue="account" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                    </TabsList>
                    <Card className="mt-4">
                        <TabsContent value="account" className="m-0">
                            <CardHeader>
                                <CardTitle>Account</CardTitle>
                                <CardDescription>Make changes to your account here.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" defaultValue="Pedro Duarte" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Save changes</Button>
                            </CardFooter>
                        </TabsContent>
                        <TabsContent value="password" className="m-0">
                            <CardHeader>
                                <CardTitle>Password</CardTitle>
                                <CardDescription>Change your password here.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="current">Current password</Label>
                                    <Input id="current" type="password" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="new">New password</Label>
                                    <Input id="new" type="password" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Save password</Button>
                            </CardFooter>
                        </TabsContent>
                    </Card>
                </Tabs>
            </div>
        </div>
    );
}

// ============================================
// SHARE BUTTON PREVIEW
// ============================================
export function ShareButtonPreview() {
    const [shared, setShared] = useState(false);

    return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100">
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Button
                    variant={shared ? "default" : "outline"}
                    className="gap-2"
                    onClick={() => {
                        setShared(true);
                        setTimeout(() => setShared(false), 2000);
                    }}
                >
                    <AnimatePresence mode="wait">
                        {shared ? (
                            <motion.span
                                key="shared"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="flex items-center gap-2"
                            >
                                ✓ Shared!
                            </motion.span>
                        ) : (
                            <motion.span
                                key="share"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="flex items-center gap-2"
                            >
                                <Share2 className="w-4 h-4" />
                                Share
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Button>
            </motion.div>
        </div>
    );
}

// ============================================
// THEME TOGGLER PREVIEW
// ============================================
export function ThemeTogglerPreview() {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');

    const icons = {
        light: Sun,
        dark: Moon,
        system: Monitor,
    };

    const nextTheme = () => {
        const order: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
        const currentIndex = order.indexOf(theme);
        setTheme(order[(currentIndex + 1) % order.length]);
    };

    const Icon = icons[theme];

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-neutral-50 to-neutral-100">
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Button
                    variant="outline"
                    size="icon"
                    onClick={nextTheme}
                    className="w-12 h-12"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={theme}
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Icon className="w-5 h-5" />
                        </motion.div>
                    </AnimatePresence>
                </Button>
            </motion.div>
            <p className="text-sm text-muted-foreground capitalize">{theme} mode</p>
        </div>
    );
}

// ============================================
// HEADLESS POPOVER PREVIEW
// ============================================
export function HeadlessPopoverPreview() {
    return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline">Open popover</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Dimensions</h4>
                            <p className="text-sm text-muted-foreground">
                                Set the dimensions for the layer.
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="width">Width</Label>
                                <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="height">Height</Label>
                                <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}

// Default export for lazy loading
export default AnimatedLogoDNAPreview;
