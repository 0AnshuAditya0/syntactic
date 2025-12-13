# Syntactic

**Where code meets creativity** - An interactive developer blog platform with live code playground and cross-device sync.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase)

## ✨ Features

### 📝 Interactive Blog
- **MDX-powered articles** with embedded executable code playgrounds
- **Live preview** while writing with syntax highlighting
- **Table of Contents** with active section tracking
- **Reading progress bar** and estimated reading time
- **Full-text search** with PostgreSQL GIN indexes
- **Series/Collections** for organizing related posts
- **Tags and filtering** for easy discovery

### 💻 Code Playground
- **Multi-language support**: JavaScript, TypeScript, Python, Java, C, C++
- **Worker-based execution** for JavaScript/TypeScript (secure sandboxing)
- **Piston API integration** for compiled languages
- **Auto-save functionality** with 2-second debounce
- **File management** with virtual folder structure
- **Anonymous users** supported (1-hour session expiry)
- **Rate limiting** and CAPTCHA for security

### 🔄 Cross-Device Sync
- **Unique private key system** for seamless authentication
- **Direct session creation** (no magic link delays)
- **Private key recovery** via email verification
- **Sync code files** across all your devices instantly

### 🎨 Modern UI/UX
- **Dark/Light mode** with system preference detection
- **Responsive design** (mobile-first approach)
- **Smooth animations** with Framer Motion
- **Keyboard shortcuts** (Cmd+K for search)
- **Accessible** (WCAG 2.1 AA compliant)

### 🔒 Security Features
- **Worker thread isolation** for code execution (no eval)
- **MDX sanitization** with DOMPurify (XSS prevention)
- **Rate limiting**: 10/min authenticated, 5/min anonymous
- **CAPTCHA** after 3 anonymous executions
- **File size limits**: 100KB code, 5MB images
- **Row Level Security** (RLS) on all database tables
- **Error monitoring** with Sentry integration

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Cloudflare Turnstile account
- Sentry account (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/0anshuaditya0/syntactic.git
   cd syntactic
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials and other API keys in `.env.local`

4. **Setup Supabase**
   - Create a new Supabase project
   - Run the complete database schema
   - Create required storage buckets and scheduled jobs

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
syntactic/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── code/            # Code execution & file management
│   │   ├── posts/           # Blog post CRUD
│   │   ├── comments/        # Comment system
│   │   └── search/          # Full-text search
│   ├── auth/                # Auth pages (login, signup, sync-login)
│   ├── blog/                # Blog listing and individual posts
│   ├── playground/          # Code playground
│   ├── write/               # Post editor
│   ├── profile/             # User profiles
│   ├── settings/            # User settings
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── auth/                # Authentication components
│   ├── blog/                # Blog-related components
│   ├── code/                # Code playground components
│   ├── mdx/                 # MDX custom components
│   └── layout/              # Layout components (header, footer)
├── lib/                     # Utility libraries
│   ├── auth/                # Authentication utilities
│   ├── code/                # Code execution utilities
│   ├── mdx/                 # MDX processing
│   ├── utils/               # General utilities
│   ├── supabase.ts          # Supabase client
│   └── monitoring.ts        # Error monitoring
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript type definitions
├── public/                  # Static assets
└── workers/                 # Worker threads for code execution
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router, Server Components)
- **Language**: TypeScript 5.3+
- **Styling**: TailwindCSS + shadcn/ui
- **Animations**: Framer Motion
- **Code Editor**: Monaco Editor
- **MDX**: next-mdx-remote

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + Custom Private Key System
- **Storage**: Supabase Storage
- **API**: Next.js Route Handlers

### Code Execution
- **JavaScript/TypeScript**: Worker threads (Node.js)
- **Python, Java, C, C++**: Piston API

### Security & Monitoring
- **CAPTCHA**: Cloudflare Turnstile
- **Error Monitoring**: Sentry
- **Sanitization**: DOMPurify

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

## 📄 License

This project is licensed under the MIT License.

## 📧 Contact

- Website: [syntactic.vercel.app](https://syntactic.vercel.app/)
- Twitter: [@AnshuAd43072185](https://x.com/AnshuAd43072185)
- LinkedIn: [Anshu Aditya](https://linkedin.com/in/0anshuaditya)

---

**Built with ❤️ by the Syntactic team**
