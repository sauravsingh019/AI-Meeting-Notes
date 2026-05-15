'use client';

import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FAQS } from '@/constants';

export function FAQSection() {
  return (
    <section className="py-24 bg-transparent" id="faq">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white mb-6">
            Frequently <span className="text-indigo-600 dark:text-indigo-400">asked</span> questions
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">
            Everything you need to know about AI Meeting Notes
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {FAQS.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-gray-100 dark:border-gray-800 rounded-2xl px-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md overflow-hidden">
                <AccordionTrigger className="text-left font-bold text-gray-900 dark:text-white hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 dark:text-gray-400 font-medium pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
