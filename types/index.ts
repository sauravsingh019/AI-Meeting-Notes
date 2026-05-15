export interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'enterprise';
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  cta: string;
  popular?: boolean;
}

export interface DashboardStats {
  totalSignups: number;
  recentSignups: number;
  mostSelectedPlan: string;
  signupsOverTime: Array<{ date: string; count: number }>;
  planDistribution: Array<{ name: string; value: number }>;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
