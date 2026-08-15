import React, { useEffect, useState } from 'react';
import { Sun, Moon, Palette } from 'lucide-react';

const ACCENTS = [
  { name: 'Warm Orange', color: '#FF5722', hover: '#E64A19' },
  { name: 'Cyber Purple', color: '#8B5CF6', hover: '#7C3AED' },
  { name: 'Emerald', color: '#10B981', hover: '#059669' },
  { name: 'Neon Blue', color: '#3B82F6', hover: '#2563EB' },
];

export const ThemeSelector: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('boundup_theme');
    return saved === 'dark';
  });
  const [currentAccent, setCurrentAccent] = useState<string>(() => {
    return localStorage.getItem('boundup_accent') || '#FF5722';
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('boundup_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('boundup_theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const accent = ACCENTS.find((a) => a.color === currentAccent) || ACCENTS[0];
    document.documentElement.style.setProperty('--primary-color', accent.color);
    document.documentElement.style.setProperty('--primary-hover', accent.hover);
    localStorage.setItem('boundup_accent', accent.color);
  }, [currentAccent]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200 transition-colors flex items-center gap-1.5"
        title="Theme & Customizer"
      >
        <Palette className="w-5 h-5 text-orange-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-700 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
              Appearance
            </span>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-1.5 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 flex items-center gap-2 text-xs font-medium"
            >
              {isDark ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-purple-400" /> Dark
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" /> Light
                </>
              )}
            </button>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 block mb-2">
              Accent Color
            </span>
            <div className="grid grid-cols-4 gap-2">
              {ACCENTS.map((acc) => (
                <button
                  key={acc.color}
                  onClick={() => setCurrentAccent(acc.color)}
                  style={{ backgroundColor: acc.color }}
                  className={`w-8 h-8 rounded-full transition-transform flex items-center justify-center ${
                    currentAccent === acc.color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'
                  }`}
                  title={acc.name}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
