"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import FileUpload from "@/components/FileUpload";
import TutorialModal from "@/components/TutorialModal";
import { uploadAndGenerate, getUserDocuments, deleteDocument } from "@/app/actions";

interface Document {
  id: string;
  filename: string;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  // Show tutorial for first-time users
  useEffect(() => {
    const seen = localStorage.getItem("quizforge-tutorial-seen");
    if (!seen) {
      setShowTutorial(true);
      localStorage.setItem("quizforge-tutorial-seen", "true");
    }
  }, []);

  // Load documents
  useEffect(() => {
    getUserDocuments().then(setDocuments);
  }, []);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadAndGenerate(formData);
      router.push(`/quiz/${result.documentId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm("Delete this quiz and all its flashcards?")) return;
    await deleteDocument(docId);
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  return (
    <>
      <Navbar onOpenTutorial={() => setShowTutorial(true)} />
      <TutorialModal
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
      />

      <div className="pt-20 px-4 pb-12 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 fade-in">
          <h1 className="text-3xl font-bold mb-2">
            Your <span className="gradient-text">Flashcards</span>
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm">
            Upload a PDF to generate AI-powered study cards
          </p>
        </div>

        {/* Upload section */}
        <div className="mb-12 fade-in" style={{ animationDelay: "0.1s" }}>
          <FileUpload onUpload={handleUpload} isUploading={isUploading} />
        </div>

        {error && (
          <div className="max-w-lg mx-auto mb-8 p-4 rounded-xl bg-[rgba(255,107,107,0.1)] border border-[var(--color-danger)] text-sm text-[var(--color-danger)] fade-in">
            {error}
          </div>
        )}

        {/* Past quizzes */}
        {documents.length > 0 && (
          <div className="fade-in" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-lg font-semibold mb-4 text-[var(--color-text-muted)]">
              Past Quizzes
            </h2>
            <div className="grid gap-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="card flex items-center justify-between gap-4 py-4 cursor-pointer group"
                  onClick={() => router.push(`/quiz/${doc.id}`)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl">📄</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-[var(--color-primary-light)] transition-colors">
                        {doc.filename}
                      </p>
                      <p className="text-xs text-[var(--color-text-dim)]">
                        {new Date(doc.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(doc.id);
                    }}
                    className="text-[var(--color-text-dim)] hover:text-[var(--color-danger)] transition-colors text-sm px-2 cursor-pointer"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {documents.length === 0 && !isUploading && (
          <p className="text-center text-sm text-[var(--color-text-dim)] fade-in">
            No quizzes yet. Upload your first PDF above!
          </p>
        )}
      </div>
    </>
  );
}
