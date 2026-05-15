'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Twitter, Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Waitlist', href: '#waitlist' },
    ],
    company: [
      { label: 'About', href: '#' },
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
    ],
    social: [
      { icon: Twitter, href: '#', label: 'Twitter' },
      { icon: Github, href: '#', label: 'GitHub' },
      { icon: Linkedin, href: '#', label: 'LinkedIn' },
      { icon: Mail, href: '#', label: 'Email' },
    ],
  };

  return (
    <footer className="bg-transparent border-t border-gray-100 dark:border-gray-800 pt-20 pb-10 transition-colors duration-500">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                AI Meeting Notes
              </span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs font-medium">
              Transforming the way founders capture and process meeting insights with advanced AI.
            </p>
            <div className="flex gap-4">
              {footerLinks.social.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="w-9 h-9 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-indigo-600 hover:text-white transition-all duration-300 border border-gray-100 dark:border-gray-800"
                  aria-label={item.label}
                >
                  <item.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6">Product</h4>
            <ul className="space-y-4">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6">Newsletter</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed font-medium">
              Get the latest updates on AI meeting automation.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 h-10 px-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-all text-gray-900 dark:text-white"
              />
              <button className="h-10 px-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-lg text-sm font-bold hover:bg-black dark:hover:bg-gray-100 transition-all">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-50 dark:border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-medium">
          <p>© {currentYear} AI Meeting Notes. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Status</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Cookies</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
