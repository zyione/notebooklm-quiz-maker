"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Flashcard from "@/components/Flashcard";
import Navbar from "@/components/Navbar";

interface FlashcardData {
  id: string;
  front: string;
  back: string;
}

export default function QuizClient({
  flashcards,
  documentId,
}: {
  flashcards: FlashcardData[];
  documentId: string;
}) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (flashcards.length === 0) {
    return (
      <>
        <Navbar />
        <div className="pt-20 px-4 min-h-dvh flex flex-col items-center justify-center">
          <p className="text-[var(--color-text-muted)] text-lg mb-4">
            No flashcards found for this document.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="btn-primary"
          >
            ← Back to Dashboard
          </button>
        </div>
      </>
    );
  }

  const card = flashcards[currentIndex];
  const total = flashcards.length;

  return (
    <>
      <Navbar />
      <div className="pt-20 px-4 pb-12 max-w-2xl mx-auto min-h-dvh flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 fade-in">
          <button
            onClick={() => router.push("/dashboard")}
            className="btn-secondary text-sm"
          >
            ← Back
          </button>
          <span className="text-sm text-[var(--color-text-muted)] font-medium">
            {currentIndex + 1}{" "}
            <span className="text-[var(--color-text-dim)]">/ {total}</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-[var(--color-border)] rounded-full mb-8 overflow-hidden fade-in">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / total) * 100}%`,
              background:
                "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
            }}
          />
        </div>

        {/* Flashcard */}
        <div className="flex-1 flex items-center justify-center mb-8 fade-in">
          <Flashcard key={card.id} card={card} />
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4 fade-in">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <button
            onClick={() =>
              setCurrentIndex((i) => Math.min(total - 1, i + 1))
            }
            disabled={currentIndex === total - 1}
            className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>
    </>
  );
}
