# CodeMastery Platform

Modern interactive coding education platform with AI-powered tutoring, inspired by W3Schools but built with cutting-edge technologies.

## 🚀 Features

- **Interactive Code Editor** - Write and execute code directly in browser (Monaco Editor)
- **AI Tutor** - Context-aware AI assistant powered by Gemini 2.0 Flash
- **Secure Code Execution** - Docker-based sandboxed environment for Python, JavaScript, Java, C++
- **Real-time Learning** - Instant feedback and code explanations
- **Progress Tracking** - Save your learning progress and code snippets
- **Modern UI** - Beautiful, responsive 3-column layout with dark mode

## 🏗️ Architecture

### Tech Stack

**Frontend:**

- Next.js 14 (App Router, SSR)
- TypeScript
- Tailwind CSS
- Monaco Editor
- Supabase (Auth & Database)

**Backend:**

- NestJS (Node.js/TypeScript)
- PostgreSQL (via Supabase)
- Dockerode (Code execution)
- Gemini AI API

**Infrastructure:**

- Docker (Code sandboxing)
- Strapi CMS (Content management)

### Project Structure

```
codemastery/
├── apps/
│   ├── web/              # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/      # Pages & layouts
│   │   │   ├── components/
│   │   │   └── lib/
│   │   └── package.json
│   │
│   └── api/              # NestJS backend
│       ├── src/
│       │   ├── execution/ # Docker code runner
│       │   ├── ai/        # AI service
│       │   ├── auth/      # Authentication
│       │   └── lessons/   # Content API
│       └── package.json
│
├── docker/
│   ├── runners/          # Language-specific images
│   │   ├── python.Dockerfile
│   │   ├── java.Dockerfile
│   │   ├── cpp.Dockerfile
│   │   └── javascript.Dockerfile
│   └── docker-compose.yml
│
└── content/              # MDX lesson files
    ├── python/
    └── javascript/
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 20+
- Docker Desktop
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
cd apps/web
npm install
```

**Backend:**

```bash
cd apps/api
npm install
```

### 3. Setup environment variables

**Frontend** (`apps/web/.env`):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GOOGLE_API_KEY=your-gemini-api-key
```

**Backend** (`apps/api/.env`):

```env
PORT=3001
DATABASE_URL=postgresql://user:pass@localhost:5432/codemastery
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-key
GOOGLE_API_KEY=your-gemini-api-key
JWT_SECRET=your-secret-min-32-chars
```

### 4. Pull Docker images

```bash
docker pull python:3.11-alpine
docker pull openjdk:17-alpine
docker pull gcc:12-alpine
docker pull node:20-alpine
```

### 5. Run database migrations

```bash
cd apps/api
npm run migration:run
```

### 6. Start development servers

**Option A: Individual services**

Terminal 1 - Frontend:

```bash
cd apps/web
npm run dev
```

Terminal 2 - Backend:

```bash
cd apps/api
npm run start:dev
```

**Option B: Docker Compose**

```bash
cd docker
docker-compose up
```

### 7. Access the application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api/docs

## 🔒 Security

The platform implements multiple security layers:

- **Docker Sandboxing** - Isolated containers with resource limits
- **Input Validation** - Code size limits, pattern blacklisting
- **Rate Limiting** - Prevents abuse
- **Network Isolation** - No internet access from containers
- **Read-only Filesystem** - Prevents file system attacks
- **Timeouts** - 5-second execution limit

See [security_guide.md](./security_guide.md) for detailed security documentation.

## 📖 Documentation

- [Implementation Plan](./implementation_plan.md) - Detailed architecture and code examples
- [Security Guide](./security_guide.md) - Security considerations and best practices
- [Task Checklist](./task.md) - Development roadmap

## 🧪 Testing

```bash
# Frontend tests
cd apps/web
npm test
npm run test:e2e

# Backend tests
cd apps/api
npm test
```

## 🚢 Deployment

### Docker Production Build

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Vercel (Frontend)

```bash
cd apps/web
vercel deploy
```

### Railway/Render (Backend)

Connect your GitHub repository and set environment variables.

## 📝 Creating Lessons

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

## 🙏 Acknowledgments

- Inspired by [W3Schools](https://www.w3schools.com)
- Built with [Next.js](https://nextjs.org)
