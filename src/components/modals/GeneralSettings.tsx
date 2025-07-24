// src/components/modals/GeneralSettings.tsx

import React, { useState, useEffect } from 'react';

type Theme = 'system' | 'dark' | 'light';

export default function GeneralSettings() {
  // Simple theme state management. For a larger app, use React Context.
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div>
      <h3 className="text-lg font-medium leading-6 text-white">General</h3>
      <p className="mt-1 text-sm text-zinc-400">
        Customize the application's appearance.
      </p>
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <label htmlFor="theme" className="text-sm font-medium text-white">
            Theme
          </label>
          <select
            id="theme"
            name="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
            className="rounded-md border-zinc-600 bg-zinc-700 px-3 py-2 text-white focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>
    </div>
  );
}