# QuizForge — PDF to Flashcards

Upload any PDF and instantly generate **Anki-style flashcards** using AI. Built with Next.js, Supabase, and the Gemini API.

## Features

- **PDF Upload** — Drag-and-drop or click to upload any PDF document
- **AI-Powered Generation** — Google Gemini reads your document and creates Q&A flashcards
- **Anki-Style Review** — Flip through cards with a 3D card-flip animation
- **Multi-User** — Each user has their own account, documents, and flashcards
- **Onboarding Tutorial** — First-time users get a guided walkthrough
- **Zero Cost** — Runs entirely on free tiers (Vercel, Supabase, Gemini API)

## Tech Stack

| Layer           | Technology                             |
| --------------- | -------------------------------------- |
| Framework       | Next.js 16 (App Router)                |
| Styling         | Tailwind CSS                           |
| Database & Auth | Supabase (PostgreSQL + Auth + Storage) |
| AI              | Google Gemini 2.0 Flash                |
| PDF Parsing     | pdf-parse                              |
| Deployment      | Vercel                                 |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A free [Supabase](https://supabase.com) project
- A free [Gemini API key](https://aistudio.google.com/apikey)

### Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/zyione/notebooklm-quiz-maker.git
   cd notebooklm-quiz-maker
   npm install
   ```

2. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your Supabase URL, Anon Key, and Gemini API Key.

3. **Set up Supabase**
   - Run the SQL migration in `supabase/migrations/0001_initial_schema.sql` via the Supabase SQL Editor
   - Create a private `pdfs` storage bucket
   - Add storage policies (see the migration file comments for details)

4. **Run the dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── actions.ts          # Server Actions (upload, generate, CRUD)
│   ├── layout.tsx           # Root layout with Inter font & blobs
│   ├── page.tsx             # Redirects to /dashboard
│   ├── login/page.tsx       # Login / Signup page
│   ├── auth/callback/       # OAuth/email confirmation callback
│   ├── dashboard/page.tsx   # Main dashboard with upload & past quizzes
│   └── quiz/[documentId]/   # Flashcard review page
├── components/
│   ├── Navbar.tsx           # Glass navbar with logout & tutorial trigger
│   ├── FileUpload.tsx       # Drag-and-drop PDF upload
│   ├── Flashcard.tsx        # 3D flip card component
│   └── TutorialModal.tsx    # Onboarding walkthrough modal
├── lib/
│   ├── gemini.ts            # Gemini API client
│   └── supabase/            # Supabase browser, server, and middleware clients
└── middleware.ts            # Auth session refresh & route protection
```

## License

MIT
