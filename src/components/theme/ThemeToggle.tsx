import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../../stores/useThemeStore';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Sun className="w-4 h-4 text-yellow-400" />
        <div
          role="checkbox"
          aria-checked={theme === 'dark'}
          tabIndex={0}
          onClick={toggleTheme}
          onKeyDown={(e) => e.key === 'Enter' && toggleTheme()}
          className={`
            w-11 h-6 rounded-full p-1 cursor-pointer transition-colors
            ${theme === 'dark' ? 'bg-primary' : 'bg-gray-300'}
          `}
        >
          <div
            className={`
              w-4 h-4 rounded-full bg-white transition-transform
              ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </div>
        <Moon className="w-4 h-4 text-blue-400" />
      </div>
      <span className="text-sm text-gray-400">
        {theme === 'dark' ? 'Modo Escuro' : 'Modo Claro'}
      </span>
    </div>
  );
}