"use client";

import { useState } from "react";

interface FlashcardData {
  id: string;
  front: string;
  back: string;
}

export default function Flashcard({ card }: { card: FlashcardData }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="w-full cursor-pointer"
      style={{ perspective: "1200px" }}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className="relative w-full min-h-[280px] transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 glass rounded-2xl p-8 flex flex-col items-center justify-center text-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className="text-xs font-semibold text-[var(--color-primary-light)] uppercase tracking-widest mb-4">
            Question
          </span>
          <p className="text-lg font-medium leading-relaxed">{card.front}</p>
          <span className="mt-6 text-xs text-[var(--color-text-dim)]">
            Tap to reveal
          </span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 glass rounded-2xl p-8 flex flex-col items-center justify-center text-center"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <span className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-widest mb-4">
            Answer
          </span>
          <p className="text-lg font-medium leading-relaxed">{card.back}</p>
          <span className="mt-6 text-xs text-[var(--color-text-dim)]">
            Tap to flip back
          </span>
        </div>
      </div>
    </div>
  );
}
