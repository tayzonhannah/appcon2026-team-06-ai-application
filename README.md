# Conscious Future — AI Parenting & Growth Platform (Team 06)

A modern, empathetic web application designed to help parents build healthy digital habits with their children, featuring dynamic growth tracking, parent reflection tools, kid mission challenges, live Supabase database backend, and Gemini AI integration.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org) with TypeScript & React 19
- **Backend & Database**: [Supabase](https://supabase.com) (Auth, PostgreSQL DB, Row Level Security)
- **AI Integration**: [Google Gemini API](https://ai.google.dev)
- **Styling**: Tailwind CSS & Modern Design Utilities
- **Hosting**: [Vercel](https://vercel.com)

---

## 📁 Repository Structure

The project application code is located inside the **[`team-06`](file:///team-06)** directory:

```
appcon2026-team-06-ai-application/
├── team-06/                 # Next.js Application Root
│   ├── app/                 # Next.js App Router (Dashboard, Auth, Kid views)
│   ├── components/          # UI Components
│   ├── lib/                 # Auth services, stores, Supabase helpers
│   ├── public/              # Static assets
│   ├── package.json         # Project dependencies & build scripts
│   └── next.config.ts       # Next.js configuration
└── README.md                # Project documentation
```

---

## ⚙️ Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   ```

2. **Navigate into the application folder**:
   ```bash
   cd team-06
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Configure Environment Variables**:
   Create a `.env.local` file inside `team-06/` containing:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://ohflcaydlksbdoxxydep.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   GEMINI_API_KEY=your-gemini-api-key
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Database Setup

Run the following tables and RLS policies in the **Supabase SQL Editor**:

- `profiles`: User profile data linked to Supabase Auth.
- `growth_actions`: Parent-assigned growth habits for children.
- `token_awards`: Reward minute tokens earned by children.
- `kid_challenges`: Gamified challenges & milestones for kids.

---

## ☁️ Vercel Deployment Instructions

When deploying this repository to Vercel:

1. Connect your repository on Vercel.
2. Go to **Project Settings** -> **General**.
3. Set **Root Directory** to `team-06`.
4. Add Environment Variables under **Settings** -> **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
5. Trigger Deployment.

---

## 🤖 Gemini AI Features

- **Parenting Assistant (`/(dashboard)/chatbot`)**: Real-time AI parenting strategies and resource recommendations.
- **Kid Compass Buddy (`/(kid)/kid/chatbot`)**: Empathetic AI conversation partner for kids to process emotions.
- **Parent Reflection Synthesis (`/(dashboard)/assessment`)**: Dynamic AI evaluation of parenting styles.