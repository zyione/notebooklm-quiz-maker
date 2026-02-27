# Superpowers Write Plan

## Goal

Build a zero-cost, multi-tenant web application using Next.js, Supabase, and the Gemini API that allows users to upload PDFs and automatically generate Anki-style flashcards.

## Assumptions

- We will use **Next.js (App Router)** as the full-stack framework.
- We will use **Supabase** for PostgreSQL database, Authentication, and Storage. We assume the user will set up a free Supabase project and provide the URL/Anon Key.
- We will use the **Google Gemini API** (specifically `gemini-1.5-flash` or similar) for parsing PDF text into JSON flashcards. We assume the user will provide a free Gemini API key.
- We will use `pdf-parse` (or a similar stable library) in a Next.js Server Action to extract text from the PDF.
- We will use vanilla CSS or Tailwind CSS for styling (per user preference). For speed and modern design, we'll configure standard Tailwind.

## Plan

### Step 1: Project Setup and Dependencies

- **Files:**
  - `package.json` (New)
  - `next.config.mjs` (New)
  - `tailwind.config.ts` (New)
- **Change:** Initialize a new Next.js project with Tailwind CSS and TypeScript. Install Supabase client (`@supabase/supabase-js`), PDF parser (`pdf-parse`), and Google Gen AI SDK (`@google/genai`).
- **Verify:** Run `npm run dev` and ensure the default Next.js page loads on `http://localhost:3000`.

### Step 2: Supabase Integration & Database Schema

- **Files:**
  - `lib/supabase.ts` (New)
  - `supabase/migrations/0001_initial_schema.sql` (New - for reference/execution)
- **Change:**
  1. Create a Supabase client singleton in `lib/supabase.ts`.
  2. Write SQL to create tables: `documents` (id, user_id, filename, created_at) and `flashcards` (id, document_id, user_id, front, back, created_at).
  3. Enable Row Level Security (RLS) on these tables so users only see their own data.
  4. Create a Supabase Storage bucket named `pdfs`.
- **Verify:** User manually runs the SQL in their Supabase SQL Editor and confirms tables/buckets exist, and provides `.env.local` with Supabase keys.

### Step 3: Global Styling & Modern UI Shell

- **Files:**
  - `app/globals.css` (Modify)
  - `app/layout.tsx` (Modify)
  - `components/Navbar.tsx` (New)
- **Change:** Strip out default Next.js boilerplate css. Add a premium, modern design system (glassmorphism, subtle gradients, dark mode support). Build a generic shell with a Navbar.
- **Verify:** Check UI visually in the browser.

### Step 4: Authentication Flow (Login/Signup)

- **Files:**
  - `app/login/page.tsx` (New)
  - `app/auth/callback/route.ts` (New)
- **Change:** Implement a simple Auth UI using Supabase Email/Password or OAuth. Create the callback route to handle session setting in cookies.
- **Verify:** Successfully create a test user, log in, and see the session cookie in the browser.

### Step 5: Onboarding Tutorial & Info Modal

- **Files:**
  - `components/TutorialModal.tsx` (New)
  - `components/Navbar.tsx` (Modify)
- **Change:** Build a simple modal or dialog that explains how the site works (upload PDF -> Gemini generates flashcards -> study). Automatically show this to first-time users (using local storage to track), and add a "?" or "How to use" button in the Navbar to open it on demand.
- **Verify:** Clear local storage, refresh the page, verify the modal pops up automatically. Close it, then click the Navbar button to reopen it.

### Step 6: PDF Upload Component

- **Files:**
  - `app/dashboard/page.tsx` (New)
  - `components/FileUpload.tsx` (New)
- **Change:** Build a drag-and-drop file upload zone. When a PDF is selected, upload it to the Supabase `pdfs` storage bucket and create a record in the `documents` table.
- **Verify:** Upload a test PDF in the UI and verify the file appears in Supabase Storage and the `documents` table.

### Step 7: PDF Parsing & Gemini API Integration

- **Files:**
  - `app/api/generate/route.ts` (New) OR Server Action
  - `lib/gemini.ts` (New)
- **Change:**
  1. Download the file from Supabase Storage (or receive file buffer directly).
  2. Parse the text using `pdf-parse`.
  3. Send a structured prompt to Gemini asking it to output an array of JSON objects `{"front": "...", "back": "..."}` based on the text.
  4. Insert the resulting flashcards into the `flashcards` table.
- **Verify:** Call the endpoint with a test document ID. Verify that Gemini returns valid JSON and that rows are created in the `flashcards` table.

### Step 8: Flashcard Review UI

- **Files:**
  - `app/quiz/[documentId]/page.tsx` (New)
  - `components/Flashcard.tsx` (New)
- **Change:** Build a dynamic frontend to display flashcards. Implement flip animations, "Next"/"Previous" buttons, and an Anki-style review feel.
- **Verify:** Navigate to the quiz page for an uploaded document and successfully flip through the generated cards.

## Risks & mitigations

- **Risk:** `pdf-parse` fails on certain complex PDFs.
  - **Mitigation:** Wrap the parser in a try-catch and alert the user if extraction fails. Provide clear error messages.
- **Risk:** Serverless function timeout during LLM generation.
  - **Mitigation:** The Gemini Flash model is very fast, but if timeouts occur, we might need to swap to Edge runtime or chunk the document if it's massive.
- **Risk:** Supabase configuration differences.
  - **Mitigation:** Provide explicit SQL instructions for RLS policies to ensure the user configures it exactly right without security holes.

## Rollback plan

- Since this is a greenfield project, there is no existing production system to break.
- If a step fails, we simply delete the modified files or revert the most recent Git commit (if tracking) and clear the Supabase database.
