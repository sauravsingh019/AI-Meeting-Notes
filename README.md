# 🚀 Founder Launch Kit: AI Meeting Notes

**🔴 Live Demo:** https://ai-meeting-notes1.vercel.app/

A production-ready **Waitlist + Dashboard system** built for modern AI startups.
Designed to help founders validate ideas, capture early users, and monitor traction—before building the full product.

---

## 🧐 Overview

This project simulates a real-world SaaS launch environment for a **solo founder**, combining a high-conversion landing page with a powerful internal dashboard.

### **1. Public Experience (Landing Page)**

A visually polished landing page where users can:

* Understand the product instantly
* Join the waitlist
* Experience a premium, responsive UI

### **2. Private Experience (Founder Dashboard)**

A secure dashboard that enables founders to:

* Track waitlist signups in real time
* Analyze growth and engagement
* Manage subscription states

---

## ✨ Key Features

* **Premium UI System**
  Modern design with glassmorphism, gradients, and micro-interactions

* **Real-time Backend**
  Powered by Supabase for instant data sync

* **Analytics Dashboard**
  Visual insights using Recharts

* **Payments Integration**
  Dynamic checkout flows with Stripe

* **Smooth Interactions**
  Motion-driven UX using Framer Motion

* **Dark / Light Mode**
  Fully responsive theming across the app

---

## 📂 Project Structure

```text id="l9k2sx"
ai-meeting-notes/
├── app/                  # Next.js App Router (Pages & APIs)
│   ├── api/              # Stripe & Auth endpoints
│   ├── dashboard/        # Private founder dashboard
│   └── layout.tsx        # Global layout & theme config
├── components/           # Reusable UI components
│   ├── landing/          # Landing page sections
│   ├── dashboard/        # Charts, stats, tables
│   └── layout/           # Navbar, footer, backgrounds
├── hooks/                # Custom hooks & auth logic
├── lib/                  # Supabase & Stripe clients
└── public/               # Static assets
```

---

## 🧠 Design & Technical Decisions

* **Tech Stack Choice**
  Built with Next.js (App Router) for SSR, routing, and API handling.
  Supabase was selected for its real-time database and minimal backend setup.

* **UI Approach**
  Focused on creating a high-quality, responsive interface using motion, layered visuals, and smooth transitions to enhance perceived product value.

* **Tradeoffs**

  * Replaced D3.js with Recharts for faster integration
  * Switched from CSS animations to Framer Motion for better control

* **AI-Assisted Development**
  AI tools were used to:

  * Explore UI variations (Tailwind CSS styling)
  * Generate mock data for charts
  * Debug Stripe integration during deployment

---

## 🚀 Getting Started

### 1. Install dependencies

```bash id="z9y4bx"
npm install
```

### 2. Run locally

```bash id="2q4ncv"
npm run dev
```

### 3. Environment setup

Create a `.env.local` file and add your credentials:

* Supabase keys
* Stripe API keys

(Refer to official docs if needed)

---

## 📈 Use Cases

* Launching MVPs quickly
* Validating startup ideas
* Building investor-ready demos
* Learning modern full-stack architecture

---

## 🛡️ License

MIT License

---

## 🤝 Contributing

Contributions, ideas, and feedback are welcome.
Feel free to fork the project or open an issue.

---

## 💡 Final Note

This project focuses on **speed, presentation, and real-world usability**—helping founders move from idea → validation with minimal friction.

