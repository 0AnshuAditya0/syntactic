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
- Supabase account ([create one here](https://supabase.com))
- Cloudflare Turnstile account (for CAPTCHA)
- Sentry account (for error monitoring, optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/syntactic.git
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
   
   a. Create a new Supabase project
   
   b. Run the complete database schema (see `docs/database-schema.sql`)
   
   c. Create storage buckets:
      - `avatars` (public, 2MB limit, images only)
      - `post-images` (public, 5MB limit, images only)
      - `code-files` (private, 1MB limit)
   
   d. Setup scheduled job for cleanup:
      - Name: `cleanup-expired-files`
      - Schedule: Every hour (`0 * * * *`)
      - SQL: `DELETE FROM public.code_files WHERE expires_at < NOW() AND user_id IS NULL;`

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
- **Code Editor**: Monaco Editor (VS Code engine)
- **MDX**: next-mdx-remote + remark/rehype plugins

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
- **Sanitization**: DOMPurify (isomorphic)

## 🔐 Security

This project implements enterprise-grade security measures:

- ✅ **Worker thread isolation** for JavaScript execution (no `eval()`)
- ✅ **MDX sanitization** to prevent XSS attacks
- ✅ **Rate limiting** on code execution
- ✅ **CAPTCHA** for anonymous users
- ✅ **File size validation** on client and server
- ✅ **Row Level Security** (RLS) policies on all tables
- ✅ **Private key hashing** with bcrypt (12 rounds)
- ✅ **Environment variable protection**

See [security-guidelines.md](./docs/security-guidelines.md) for detailed security documentation.

## 📚 Documentation

- [Implementation Plan](./docs/implementation-plan.md)
- [Security Guidelines](./docs/security-guidelines.md)
- [Database Schema](./docs/database-schema.sql)
- [API Documentation](./docs/api.md) (coming soon)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- lib/auth/private-key.test.ts

# Run with coverage
npm test -- --coverage
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production

Make sure to set these in your Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for Admin API)
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `SENTRY_DSN`
- `NEXT_PUBLIC_SENTRY_DSN`

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - VS Code's editor
- [Piston](https://github.com/engineer-man/piston) - Code execution engine
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) - Privacy-first CAPTCHA

## 📧 Contact

- Website: [syntactic.dev](https://syntactic.dev)
- Twitter: [@syntactic_dev](https://twitter.com/syntactic_dev)
- Email: hello@syntactic.dev

---

**Built with ❤️ by the Syntactic team**
