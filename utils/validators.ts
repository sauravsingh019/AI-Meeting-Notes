import { z } from 'zod';

export const waitlistSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  plan: z.enum(['free', 'pro', 'enterprise']),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type WaitlistFormData = z.infer<typeof waitlistSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
