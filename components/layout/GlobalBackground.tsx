'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function GlobalBackground() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-background">
      {/* Mesh Gradient / Animated Blobs */}
      <div className="absolute inset-0 opacity-40 dark:opacity-30 transition-opacity duration-1000">
        <motion.div
          animate={{
            x: [0, 150, -50, 0],
            y: [0, 80, 150, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] left-[-5%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-indigo-400/40 to-purple-400/40 dark:from-indigo-600/30 dark:to-blue-600/30 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -120, 60, 0],
            y: [0, 180, -70, 0],
            scale: [1.1, 1.3, 1, 1.1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[-15%] right-[-5%] w-[75%] h-[75%] rounded-full bg-gradient-to-tr from-purple-400/30 to-blue-400/30 dark:from-blue-600/20 dark:to-indigo-600/20 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, 70, -130, 0],
            y: [0, -150, 90, 0],
            scale: [1, 1.4, 0.8, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-[20%] right-[15%] w-[55%] h-[55%] rounded-full bg-gradient-to-br from-blue-300/20 to-indigo-300/20 dark:from-indigo-500/10 dark:to-purple-500/10 blur-[100px]"
        />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 dark:opacity-20" />

      {/* Noise Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay" />
    </div>
  );
}
