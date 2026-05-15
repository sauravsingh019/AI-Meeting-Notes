'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FEATURES } from '@/constants';
import * as Icons from 'lucide-react';

export function FeaturesSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="py-24 bg-transparent relative overflow-hidden" id="features">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Built for <span className="text-indigo-600 dark:text-indigo-400">performance.</span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
            Everything you need to automate your workflow.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {FEATURES.map((feature) => {
            const IconComponent = (Icons as any)[feature.icon] || Icons.Zap;
            return (
              <motion.div 
                key={feature.title} 
                variants={item}
                whileHover={{ y: -8, scale: 1.01 }}
                className="group"
              >
                <Card className="h-full border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.02)] bg-white/70 dark:bg-gray-900/70 backdrop-blur-md hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-500 rounded-[32px] relative overflow-hidden flex flex-col group/card">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] to-purple-500/[0.02] opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                  
                  <CardHeader className="p-8 pb-3 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6 group-hover/card:bg-indigo-600 group-hover/card:shadow-lg group-hover/card:shadow-indigo-100 transition-all duration-500 transform group-hover/card:rotate-6">
                      <IconComponent className="w-6 h-6 text-gray-900 dark:text-white group-hover/card:text-white transition-colors duration-500" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover/card:text-indigo-600 dark:group-hover/card:text-indigo-400 transition-colors duration-500">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 pb-10 relative z-10 flex-grow">
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-medium">
                      {feature.description}
                    </p>
                  </CardContent>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
