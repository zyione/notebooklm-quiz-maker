# Superpowers Brainstorm

## Goal

Build a web application that allows multiple users to upload PDF documents and automatically generate Anki-style flashcards/quizzes from them using an LLM (similar to NotebookLM). Each user should be able to create, store, and manage multiple quizzes independently.

## Constraints

- **Multi-tenancy:** The system must support user accounts, authenticating users, and restrict access so users can only view their own PDFs and generated quizzes.
- **LLM Integration:** Must integrate with an API to process PDF text into structured Q&A format.
- **PDF Processing:** Must accurately extract text from PDF files before passing it to the LLM.
- **Zero-Cost Operation:** Must be completely free to deploy and run. This requires utilizing free-tier hosting, free database services, and a free-tier LLM API.

## Known context

- You requested "Notebook LLM" functionality, implying a RAG-like or long-context interaction where an LLM grounds its generation on the provided document.
- "Anki-style" implies flashcards with a Front (Question) and Back (Answer), potentially with spaced repetition logic or a simple review interface.
- Python is not a strict requirement, opening the door to full-stack JavaScript frameworks which are often easier to host entirely for free on platforms like Vercel.

## Risks

- **Free Tier Rate Limits:** Free LLM APIs (like Gemini's free tier) have rate limits (Requests Per Minute). Uploading massive PDFs or generating too many quizzes at once could hit these limits.
- **Context Limits & Token Costs:** Processing large PDFs can exceed free LLM token limits if the text isn't chunked properly.
- **Accuracy / Hallucinations:** The LLM might generate irrelevant flashcards or miss key concepts from the text.
- **Serverless Timeouts:** PDF parsing and LLM generation can take time. Free serverless functions (e.g., on Vercel) often timeout after 10-60 seconds, which might necessitate background queues or client-side parsing.

## Options (2–4)

1. **Next.js Full-Stack + Supabase + Gemini API (Recommended for Zero Cost)**
   - **Frontend/Backend:** Next.js deployed on Vercel (free).
   - **Database/Auth:** Supabase free tier for PostgreSQL, Authentication, and PDF file storage.
   - **LLM:** Google Gemini 1.5 Flash API (offers a very generous free tier with high context windows, perfect for large PDFs).
   - **PDF Parsing:** Done via `pdf-parse` in Next.js Server Actions or via `pdf.js` on the browser to avoid serverless function timeouts.

2. **React/Vite (SPA) + Firebase + Groq API**
   - **Frontend:** React deployed on Netlify/Vercel (free).
   - **Database/Auth:** Firebase (Firestore + Firebase Auth) free tier.
   - **LLM:** Groq API (has a fast, free tier for Llama 3 models, though context windows are smaller than Gemini).
   - **PDF Parsing:** Done client-side since Firebase doesn't run backend logic without paid Cloud Functions.

3. **Django/FastAPI Backend + React + Render/Railway Free Tiers**
   - If you still wanted Python, you could use a free PostgreSQL DB and host the backend on a free tier like Render. However, Render's free tier spins down on inactivity, causing 50-second cold starts. This is generally a worse user experience than serverless Next.js edge functions.

## Recommendation

**Option 1 (Next.js + Supabase + Gemini API)** is highly recommended.
Supabase provides excellent free-tier authentication, database, and file storage. Next.js on Vercel handles frontend and serverless API routes effortlessly. The Gemini API is currently the best choice for this zero-cost constraint because its free tier offers a massive 1 million+ token context window, allowing you to pass entire PDFs to the LLM without ever exceeding free limits or paying.

## Acceptance criteria

1. Users can sign up, log in, and log out securely.
2. A logged-in user can upload a PDF document and receive a confirmation.
3. The system extracts text from the uploaded PDF and sends it to a free-tier LLM to generate an array of Q&A flashcards.
4. The generated flashcards are saved in the database, immutably linked to the user's account and the specific document.
5. Users can view a dashboard of their past quizzes and review them using an Anki-like flashcard interface.
6. The entire stack uses free-tier solutions for hosting, database, and LLM usage.
