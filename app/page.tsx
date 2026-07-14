'use client';

import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { WaitlistSection } from '@/components/landing/WaitlistSection';
import { LiveSocialProof } from '@/components/landing/LiveSocialProof';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <WaitlistSection />
      <LiveSocialProof />
      <Footer />
    </main>
  );
}
