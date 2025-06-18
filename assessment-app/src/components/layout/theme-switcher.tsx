
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Sun, Moon, Palette, RotateCcw } from "lucide-react";
import { APP_THEMES, DEFAULT_THEME_NAME, LOCAL_STORAGE_THEME_KEY, LOCAL_STORAGE_THEME_MODE_KEY } from "@/lib/constants";
import type { AppTheme, ThemeMode, ThemeColors } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [selectedThemeName, setSelectedThemeName] = useState<string>(DEFAULT_THEME_NAME);
  const [currentMode, setCurrentMode] = useState<ThemeMode>('dark'); // Default to dark as per layout
  const [popoverOpen, setPopoverOpen] = useState(false);

  const applyThemeStyles = (themeColors: ThemeColors) => {
    const root = document.documentElement;
    Object.entries(themeColors).forEach(([key, value]) => {
      const cssVarName = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      root.style.setProperty(cssVarName, value);
    });
  };
  
  // Effect for initializing and applying theme
  useEffect(() => {
    setMounted(true);
    const storedThemeName = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) || DEFAULT_THEME_NAME;
    const storedMode = (localStorage.getItem(LOCAL_STORAGE_THEME_MODE_KEY) as ThemeMode) || 'dark';
    
    setSelectedThemeName(storedThemeName);
    setCurrentMode(storedMode);

    const themeToApply = APP_THEMES.find(t => t.name === storedThemeName) || APP_THEMES.find(t => t.name === DEFAULT_THEME_NAME)!;
    
    if (storedMode === 'system') {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyThemeStyles(themeToApply[systemPrefersDark ? 'dark' : 'light']);
      document.documentElement.classList.toggle('dark', systemPrefersDark);
    } else {
      applyThemeStyles(themeToApply[storedMode]);
      document.documentElement.classList.toggle('dark', storedMode === 'dark');
    }
  }, []);

  // Effect for handling theme changes
  useEffect(() => {
    if (!mounted) return;

    const currentTheme = APP_THEMES.find(t => t.name === selectedThemeName) || APP_THEMES.find(t => t.name === DEFAULT_THEME_NAME)!;

    let effectiveMode: 'light' | 'dark';

    if (currentMode === 'system') {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      effectiveMode = systemPrefersDark ? 'dark' : 'light';
      applyThemeStyles(currentTheme[effectiveMode]);
      document.documentElement.classList.toggle('dark', systemPrefersDark);
    } else {
      effectiveMode = currentMode;
      applyThemeStyles(currentTheme[effectiveMode]);
      document.documentElement.classList.toggle('dark', effectiveMode === 'dark');
    }
    
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, selectedThemeName);
    localStorage.setItem(LOCAL_STORAGE_THEME_MODE_KEY, currentMode);

  }, [selectedThemeName, currentMode, mounted]);


  // Effect for system preference changes
   useEffect(() => {
    if (!mounted || currentMode !== 'system') return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const systemPrefersDark = mediaQuery.matches;
      const themeToApply = APP_THEMES.find(t => t.name === selectedThemeName) || APP_THEMES.find(t => t.name === DEFAULT_THEME_NAME)!;
      applyThemeStyles(themeToApply[systemPrefersDark ? 'dark' : 'light']);
      document.documentElement.classList.toggle('dark', systemPrefersDark);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mounted, currentMode, selectedThemeName]);


  if (!mounted) {
    return ( // Render a placeholder or null during server-side rendering and initial mount
        <div className="fixed bottom-4 right-4 z-50">
            <Button variant="outline" size="icon" className="rounded-full shadow-lg" disabled>
                <Settings className="h-5 w-5 animate-spin" />
            </Button>
        </div>
    );
  }

  const handleThemeSelect = (themeName: string) => {
    setSelectedThemeName(themeName);
  };

  const handleModeToggle = (isDark: boolean) => {
    setCurrentMode(isDark ? 'dark' : 'light');
  };
  
  const handleResetToDefault = () => {
    setSelectedThemeName(DEFAULT_THEME_NAME);
    setCurrentMode('dark'); // Default to dark as per original layout
    const defaultTheme = APP_THEMES.find(t => t.name === DEFAULT_THEME_NAME)!;
    applyThemeStyles(defaultTheme.dark);
    document.documentElement.classList.add('dark');
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, DEFAULT_THEME_NAME);
    localStorage.setItem(LOCAL_STORAGE_THEME_MODE_KEY, 'dark');
  };
  
  const isDarkModeActive = currentMode === 'dark' || (currentMode === 'system' && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <div className="fixed bottom-4 right-4 z-[100]">
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-full shadow-lg bg-card hover:bg-accent/20">
            <Settings className={`h-5 w-5 transition-transform duration-300 ${popoverOpen ? "rotate-90" : ""}`} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4 space-y-4" align="end">
          <div className="space-y-2">
            <Label htmlFor="theme-mode" className="text-sm font-medium flex items-center">
              <Palette className="w-4 h-4 mr-2" /> Appearance
            </Label>
            <div className="flex items-center justify-between p-2 bg-muted rounded-md">
              <div className="flex items-center space-x-2">
                <Sun className={`w-5 h-5 ${!isDarkModeActive ? "text-primary" : "text-muted-foreground"}`} />
                <Switch
                  id="theme-mode-toggle"
                  checked={isDarkModeActive}
                  onCheckedChange={handleModeToggle}
                  disabled={currentMode === 'system'}
                />
                <Moon className={`w-5 h-5 ${isDarkModeActive ? "text-primary" : "text-muted-foreground"}`} />
              </div>
               <Button 
                variant={currentMode === 'system' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setCurrentMode(currentMode === 'system' ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light') : 'system')}
                className="text-xs px-2 py-1 h-auto"
                >
                {currentMode === 'system' ? "System On" : "Use System"}
              </Button>
            </div>
             {currentMode === 'system' && <p className="text-xs text-muted-foreground text-center">Using system preference. Toggle unavailable.</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Themes</Label>
            <div className="grid grid-cols-3 gap-2">
              {APP_THEMES.map((theme) => (
                <Button
                  key={theme.name}
                  variant="outline"
                  size="sm"
                  onClick={() => handleThemeSelect(theme.name)}
                  className={cn(
                    "text-xs h-auto py-1 px-2 justify-center w-full truncate",
                    selectedThemeName === theme.name && "ring-2 ring-primary"
                  )}
                  title={theme.name}
                >
                  {theme.name}
                </Button>
              ))}
            </div>
          </div>
          
          <Button variant="ghost" size="sm" onClick={handleResetToDefault} className="w-full justify-center text-muted-foreground hover:text-primary">
             <RotateCcw className="w-4 h-4 mr-2" /> Reset to Default
          </Button>

        </PopoverContent>
      </Popover>
    </div>
  );
}

    