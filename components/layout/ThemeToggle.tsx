'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-20 h-10" />;

  const isDark = theme === 'dark';

  return (
    <div 
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative w-16 h-9 rounded-full bg-gray-100 dark:bg-gray-800 p-1 cursor-pointer transition-colors duration-500 border border-gray-200 dark:border-gray-700"
    >
      <motion.div
        animate={{ x: isDark ? 28 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative z-10 w-7 h-7 rounded-full bg-white dark:bg-gray-950 shadow-md flex items-center justify-center"
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 text-indigo-400" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-500" />
        )}
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-between px-2.5">
        <Sun className={`w-3 h-3 ${isDark ? 'text-gray-600' : 'text-transparent'} transition-colors`} />
        <Moon className={`w-3 h-3 ${!isDark ? 'text-gray-400' : 'text-transparent'} transition-colors`} />
      </div>
    </div>
  );
}

function useState(initial: boolean): [boolean, any] {
    return React.useState(initial);
}
