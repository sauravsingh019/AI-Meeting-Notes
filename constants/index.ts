import { Feature, Testimonial, FAQ, PricingPlan } from '@/types';

export const SITE_CONFIG = {
  name: 'AI Meeting Notes',
  tagline: 'Turn Meeting Notes into Actionable Results',
  description: 'AI-powered meeting notes that automatically transcribe, summarize, and extract action items from your calls.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  email: 'hello@aimeetingnotes.com',
  twitter: '@aimeetingnotes',
  github: 'aimeetingnotes',
} as const;

export const FEATURES: Feature[] = [
  { title: 'Real-time Transcription', description: 'Accurate, real-time transcription with speaker diarization and smart punctuation.', icon: 'Mic' },
  { title: 'AI Summaries', description: 'Get concise, actionable summaries that capture key decisions and discussion points.', icon: 'FileText' },
  { title: 'Smart Action Items', description: 'Automatically extract and assign action items with due dates and priority levels.', icon: 'CheckSquare' },
  { title: 'Meeting Analytics', description: 'Track meeting effectiveness, participation rates, and follow-through on action items.', icon: 'BarChart3' },
  { title: 'Integrations', description: 'Connect with Slack, Notion, Asana, Jira, and 1000+ tools via Zapier.', icon: 'Zap' },
  { title: 'Enterprise Security', description: 'SOC2 Type II certified with end-to-end encryption and compliance controls.', icon: 'Shield' },
];

export const TESTIMONIALS: Testimonial[] = [
  { id: 1, name: 'Sarah Chen', role: 'VP of Product', company: 'TechCorp', content: 'AI Meeting Notes has transformed how our product team operates. We save 10+ hours per week on meeting follow-ups.', avatar: 'S', rating: 5 },
  { id: 2, name: 'Michael Rodriguez', role: 'Founder', company: 'ScaleUp AI', content: 'The action items extraction is magical. No more missed tasks or unclear next steps from important client calls.', avatar: 'M', rating: 5 },
  { id: 3, name: 'Emily Watson', role: 'Engineering Lead', company: 'DevStudio', content: 'Integration with our workflow is seamless. The AI summaries are surprisingly accurate and save tons of time.', avatar: 'E', rating: 5 },
];

export const FAQS: FAQ[] = [
  { question: 'How accurate is the AI transcription?', answer: 'Our AI achieves 95%+ accuracy even in noisy environments. We support 50+ languages and industry-specific terminology.' },
  { question: 'Is my data secure?', answer: 'Yes, we are SOC2 Type II certified. All data is encrypted at rest and in transit. We never use your data to train models for other customers.' },
  { question: 'Can I try it before purchasing?', answer: 'Absolutely! The Pro plan includes a 14-day free trial with full features. No credit card required.' },
  { question: 'What integrations do you support?', answer: 'We integrate with Slack, Notion, Asana, Jira, Trello, Google Workspace, Microsoft Teams, and 1000+ apps via Zapier.' },
  { question: 'Do you offer a team plan?', answer: 'Yes, our Team plan includes collaboration features, admin controls, and custom integrations for growing teams.' },
  { question: 'Can I cancel anytime?', answer: 'Yes, you can cancel your subscription at any time. No hidden fees or long-term contracts.' },
];

export const PRICING_PLANS: PricingPlan[] = [
  { id: 'free', name: 'Free', price: 0, interval: 'month', features: ['3 meetings per month', 'Basic AI summaries', 'Manual action items', 'Email support'], cta: 'Get Started', popular: false },
  { id: 'pro', name: 'Pro', price: 29, interval: 'month', features: ['Unlimited meetings', 'Advanced AI summaries', 'Smart action items extraction', 'Priority support', 'Slack integration', 'Meeting analytics'], cta: 'Start Free Trial', popular: true },
  { id: 'team', name: 'Team', price: 99, interval: 'month', features: ['Everything in Pro', 'Team collaboration', 'Admin controls', 'Custom integrations', 'Dedicated account manager', 'SLA guarantee'], cta: 'Contact Sales', popular: false },
];

export const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
];
