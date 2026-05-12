# TaskFlow Pro | KoçSistem NewChapter Technical Project

TaskFlow Pro is a next-generation AI-powered Kanban management platform designed with modern software engineering principles. It bridges the gap between high-level task management and actionable technical execution.

🚀 **Live Demo:** https://taskflowpro-kocproject.vercel.app/

## 🌟 Key Features

- **AI-Driven Task Decomposition:** Integrated with Gemini 2.5 Flash AI to automatically break down complex task descriptions into technical, actionable sub-tasks.
- **Responsive Mobile Tabbed View:** A custom-engineered mobile interface that utilizes a tab-based navigation system for seamless Kanban management on small screens.
- **Secure Authentication:** Robust user session management powered by Supabase Auth and Google OAuth.
- **Intuitive Drag & Drop:** Smooth task transitions across columns using the @dnd-kit library, optimized for both desktop and touch devices.
- **Enterprise-Grade UI:** A clean, modern interface built with Tailwind CSS, focusing on accessibility and professional aesthetics.

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router & Turbopack)
- **Language:** TypeScript
- **State Management:** Zustand
- **Database & Auth:** Supabase (PostgreSQL)
- **AI Engine:** Google Gemini AI Studio
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## ⚙️ Local Development Setup

To run this project locally, follow these steps:

1. **Clone the repository:**
   git clone https://github.com/Hsynecer/taskflow-pro.git
   cd taskflow-pro

2. **Install dependencies:**
   npm install

3. **Environment Variables:**
   Create a .env.local file in the root directory and add your keys:
   
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   GEMINI_API_KEY=your_gemini_api_key

4. **Run the development server:**
   npm run dev

## 📐 Architecture
The project follows a modular architecture, separating the Zustand store for state management, Supabase for persistence, and Gemini AI for dynamic content generation. The mobile-first "Tabbed View" logic ensures a consistent user experience across all devices.

---
*Developed by Hüseyin Ecer as part of the KoçSistem NewChapter technical assessment.*


