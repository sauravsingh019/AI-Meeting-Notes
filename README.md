# 🚀 Founder Launch Kit: AI Meeting Notes

A premium AI startup **Waitlist + Dashboard system** designed to impress both investors and early users. This project combines high-end animations with real-time data integration to create a polished launch experience.

---

## 🧐 What is this Project?

This is a **Launch Kit built for solo founders**, consisting of two main parts:

1. **Public Side:**
   A stunning landing page where users can learn about the product and join the waitlist.

2. **Private Side (Dashboard):**
   A secure dashboard where the founder can:

   * View user signups
   * Analyze growth and engagement
   * Manage subscription status

---

## 🛠️ What’s Included?

* **Premium Design:**
  Apple-grade visuals, glassmorphism, and custom animated backgrounds

* **Real-time Database:**
  Uses Supabase to store and fetch waitlist users

* **Smart Analytics:**
  Built with Recharts to visualize signup growth and plan statistics

* **Stripe Payments:**
  Test-mode checkout sessions with dynamic pricing using Stripe

* **Smooth UX:**
  Seamless animations powered by Framer Motion and smooth scrolling across sections

* **Dark/Light Mode:**
  Full theme support across the application

---

## 📂 Project Structure (Simplified)

```text
ai-meeting-notes/
├── app/                  # Next.js App Router (Pages & APIs)
│   ├── api/              # Stripe & Auth API routes
│   ├── dashboard/        # Founder's Private Dashboard
│   └── layout.tsx        # Global settings & Theme Provider
├── components/           # Reusable UI components
│   ├── landing/          # Hero, Features, Pricing sections
│   ├── dashboard/        # Stats, Charts, Waitlist Table
│   └── layout/           # Navbar, Footer, Global Background
├── hooks/                # Authentication & custom logic
├── lib/                  # Stripe & Supabase clients
└── public/               # Images & static assets
```

---

## 🚀 Setup & Installation

1. **Install dependencies**

```bash
npm install
```

2. **Run locally**

```bash
npm run dev
```

3. **Environment setup**
   Add your Supabase and Stripe keys in a `.env.local` file (refer to the original README for details).

---

## 🛡️ License

Built with ❤️ for the Founder Launch Kit Challenge.
Licensed under MIT.

