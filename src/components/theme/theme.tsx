// components/theme/theme.tsx
'use client';
import { useEffect, useState } from 'react';

export default function ThemeToggle({
  checked,
  onChange,
}: {
  checked?: boolean;
  onChange?: (isDark: boolean) => void;
}) {
  const [isDark, setIsDark] = useState<boolean>(() =>
    checked !== undefined
      ? checked
      : typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : true
  );

  useEffect(() => {
    if (checked !== undefined) {
      setIsDark(checked);
    }
  }, [checked]);

  const apply = (next: boolean) => {
    if (checked === undefined) {
      setIsDark(next);
    }
    document.documentElement.classList.toggle('dark', next);
    document.documentElement.style.colorScheme = next ? 'dark' : 'light';
    localStorage.setItem('theme', next ? 'dark' : 'light');
    onChange?.(next); // <- notify parent
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        apply(!isDark);
      }}
      className="rounded-md md:border md:px-3 py-1.5 text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      <div className="hidden md:block">{isDark ? '☀️' : '🌙'}</div>
      <div className="block md:hidden">
        {isDark ? 'Light mode ☀️' : 'Dark mode 🌙'}
      </div>
    </button>
  );
}
