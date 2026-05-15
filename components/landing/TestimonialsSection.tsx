'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { TESTIMONIALS } from '@/constants';

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-transparent" id="testimonials">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white mb-6">
            Loved by <span className="text-indigo-600 dark:text-indigo-400">teams</span> worldwide
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">
            Join thousands of happy founders who transformed their meeting culture.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            >
              <Card className="h-full border border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-[32px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed mb-8">{testimonial.content}</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-110 transition-transform">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white leading-none mb-1">{testimonial.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{testimonial.role} <span className="text-indigo-500">•</span> {testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
