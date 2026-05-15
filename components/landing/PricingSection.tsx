'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { AuthModal } from '../auth/AuthModal';

export function PricingSection() {
  const [loading, setLoading] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();

  const plans = [
    {
      name: "Starter",
      price: "$0",
      priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
      description: "Perfect for exploring AI notes",
      features: ["5 meetings per month", "Basic AI summary", "7-day history", "Standard export"],
      button: "Start for Free",
      highlight: false
    },
    {
      name: "Pro",
      price: "$19",
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
      description: "Best for busy solo founders",
      features: ["Unlimited meetings", "Advanced AI Insights", "Unlimited history", "Priority processing", "Custom templates"],
      button: "Get Pro Access",
      highlight: true
    },
    {
      name: "Team",
      price: "$49",
      priceId: process.env.NEXT_PUBLIC_STRIPE_TEAM_PRICE_ID,
      description: "For small scaling teams",
      features: ["Everything in Pro", "Shared workspaces", "Team analytics", "Admin controls", "API access"],
      button: "Contact Sales",
      highlight: false
    }
  ];

  const handleSubscribe = async (plan: any) => {
    if (!user) {
      toast.info("Please login first to subscribe.");
      setIsAuthModalOpen(true);
      return;
    }

    setLoading(plan.name);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId: plan.priceId,
          planName: plan.name 
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Checkout failed');
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Stripe Error:', error);
      toast.error(error.message || "Stripe integration is in test mode. Check .env settings.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="py-32 bg-transparent relative" id="pricing">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-6"
          >
            Simple, <span className="text-indigo-600 dark:text-indigo-400">transparent</span> pricing.
          </motion.h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">
            Choose the plan that fits your growth stage. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`relative h-full border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-[32px] overflow-hidden flex flex-col ${plan.highlight ? 'ring-2 ring-indigo-600 shadow-2xl shadow-indigo-100/20' : 'shadow-xl'}`}>
                {plan.highlight && (
                  <div className="absolute top-0 right-0 px-4 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-xl">
                    Most Popular
                  </div>
                )}
                <CardHeader className="p-8">
                  <CardTitle className="text-2xl font-black text-gray-900 dark:text-white mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400 font-medium">{plan.description}</CardDescription>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-5xl font-black text-gray-900 dark:text-white">{plan.price}</span>
                    <span className="text-gray-500 font-bold">/mo</span>
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8 flex-grow">
                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm font-bold text-gray-600 dark:text-gray-300">
                        <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="p-8 pt-0">
                  <Button 
                    onClick={() => handleSubscribe(plan)}
                    disabled={loading !== null}
                    className={`w-full h-14 rounded-2xl font-black text-lg transition-all active:scale-95 ${plan.highlight ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 dark:shadow-none' : 'bg-gray-900 dark:bg-white dark:text-gray-900 text-white hover:bg-black'}`}
                  >
                    {loading === plan.name ? <Sparkles className="w-5 h-5 animate-spin" /> : plan.button}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </section>
  );
}
