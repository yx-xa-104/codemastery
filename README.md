# CodeMastery Platform

Modern interactive coding education platform with AI-powered tutoring, inspired by W3Schools but built with cutting-edge technologies.

## Features

- **Interactive Code Editor** - Write and execute code directly in browser (Monaco Editor)
- **AI Tutor** - Context-aware AI assistant powered by Gemini 2.0 Flash
- **Secure Code Execution** - Sandboxed environment for Python, JavaScript, Java, C++
- **Real-time Learning** - Instant feedback and code explanations
- **Progress Tracking** - Save your learning progress and code snippets
- **Modern UI** - Beautiful, responsive 3-column layout with dark mode

## Architecture

### Tech Stack

**Frontend (Feature-Sliced Design):**

- Next.js 14 (App Router, SSR)
- TypeScript
- Tailwind CSS
- Monaco Editor
- Supabase (Auth & Database)
- Zustand (State Management)
- Shadcn UI (Components)

**Backend:**

- NestJS (Node.js/TypeScript)
- PostgreSQL (via Supabase)
- Gemini AI API

**Infrastructure:**

- Supabase (Database + Auth)
- Strapi CMS (Content management)

### Project Structure

```
codemastery/
├── apps/
│   ├── frontend/         # Next.js frontend (FSD Architecture)
│   │   ├── src/
│   │   │   ├── app/      # Routing & Pages
│   │   │   ├── features/ # Business Modules (Auth, Courses, AI, etc.)
│   │   │   └── shared/   # Components, UI (Shadcn), Stores (Zustand)
│   │   └── package.json
│   │
│   └── backend/          # NestJS backend
│       ├── src/
│       │   ├── modules/   # Business modules
│       │   ├── common/    # Shared guards, decorators
│       │   └── infrastructure/ # Database, event-bus
│       └── package.json
│
└── content/              # MDX lesson files
    ├── python/
    └── javascript/
```

## Setup & Installation

### Prerequisites

- Node.js 20+
- PostgreSQL (or Supabase account)
- Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/codemastery.git
cd codemastery
```

### 2. Install dependencies

**Frontend:**

```bash
cd apps/frontend
npm install
```

**Backend:**

```bash
cd apps/backend
npm install
```

### 3. Setup environment variables

**Frontend** (`apps/frontend/.env`):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GOOGLE_API_KEY=your-gemini-api-key
```

**Backend** (`apps/backend/.env`):

```env
PORT=3001
DATABASE_URL=postgresql://user:pass@localhost:5432/codemastery
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-key
GOOGLE_API_KEY=your-gemini-api-key
JWT_SECRET=your-secret-min-32-chars
```

### 4. Run database migrations

```bash
cd apps/backend
npm run migration:run
```

### 5. Start development servers

Terminal 1 - Frontend:

```bash
cd apps/frontend
npm run dev
```

Terminal 2 - Backend:

```bash
cd apps/backend
npm run start:dev
```

### 6. Access the application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api/docs

## 🔒 Security

The platform implements multiple security layers:

- **Input Validation** - Code size limits, pattern blacklisting
- **Rate Limiting** - Prevents abuse
- **Timeouts** - 5-second execution limit

See [security_guide.md](./security_guide.md) for detailed security documentation.

## Testing

```bash
# Frontend tests
cd apps/frontend
npm test
npm run test:e2e

# Backend tests
cd apps/backend
npm test
```

## Deployment

### Vercel (Frontend)

```bash
cd apps/frontend
vercel deploy
```

### Railway/Render (Backend)

Connect your GitHub repository and set environment variables.

## reating Lessons

Lessons are written in MDX (Markdown + JSX):

```mdx
---
title: "Python Variables"
description: "Learn about variables in Python"
difficulty: "beginner"
---

# Variables in Python

Variables are containers for storing data values.

\`\`\`python
name = "CodeMastery"
age = 1
print(name, age)
\`\`\`

<CodeEditor language="python" initialCode="name = 'Your Name'\nprint(name)" />
```

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
