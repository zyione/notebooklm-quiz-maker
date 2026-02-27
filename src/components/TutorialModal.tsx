"use client";

import { useEffect, useState } from "react";

const STEPS = [
  {
    icon: "📄",
    title: "Upload a PDF",
    description:
      "Drag and drop or click to upload any PDF document — lecture notes, textbooks, research papers.",
  },
  {
    icon: "✨",
    title: "AI Generates Flashcards",
    description:
      "Our AI reads your document and instantly creates question-and-answer flashcards from the key concepts.",
  },
  {
    icon: "🧠",
    title: "Study & Review",
    description:
      "Flip through your flashcards with a beautiful Anki-style interface. Study smarter, retain more.",
  },
];

export default function TutorialModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      // Small delay for mount animation
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isLast = currentStep === STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.25s ease",
      }}
      onClick={onClose}
    >
      <div
        className="glass-light rounded-2xl p-8 max-w-md w-full relative"
        style={{
          transform: visible ? "scale(1)" : "scale(0.95)",
          opacity: visible ? 1 : 0,
          transition: "all 0.3s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors text-lg cursor-pointer"
        >
          ✕
        </button>

        {/* Step content */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">{STEPS[currentStep].icon}</div>
          <h3 className="text-xl font-bold mb-2 gradient-text">
            {STEPS[currentStep].title}
          </h3>
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            {STEPS[currentStep].description}
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === currentStep ? "2rem" : "0.5rem",
                background:
                  i === currentStep
                    ? "var(--color-primary)"
                    : "var(--color-border-light)",
              }}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 justify-center">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              className="btn-secondary text-sm"
            >
              Back
            </button>
          )}
          <button
            onClick={() => {
              if (isLast) {
                onClose();
              } else {
                setCurrentStep((s) => s + 1);
              }
            }}
            className="btn-primary text-sm"
          >
            {isLast ? "Get Started" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
