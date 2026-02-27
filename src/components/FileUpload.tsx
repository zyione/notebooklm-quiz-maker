"use client";

import { useRef, useState } from "react";

export default function FileUpload({
  onUpload,
  isUploading,
}: {
  onUpload: (file: File) => void;
  isUploading: boolean;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }
    setSelectedFile(file);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className="card cursor-pointer flex flex-col items-center gap-4 py-12 transition-all"
        style={{
          borderColor: dragOver
            ? "var(--color-primary)"
            : selectedFile
            ? "var(--color-success)"
            : undefined,
          borderStyle: "dashed",
          borderWidth: "2px",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) handleFile(e.target.files[0]);
          }}
        />

        <div className="text-4xl">{selectedFile ? "📄" : "☁️"}</div>

        {selectedFile ? (
          <div className="text-center">
            <p className="text-sm font-medium text-[var(--color-text)]">
              {selectedFile.name}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-[var(--color-text-muted)]">
              <span className="text-[var(--color-primary-light)] font-medium">
                Click to upload
              </span>{" "}
              or drag and drop
            </p>
            <p className="text-xs text-[var(--color-text-dim)] mt-1">
              PDF files only
            </p>
          </div>
        )}
      </div>

      {/* Generate button */}
      {selectedFile && (
        <div className="mt-4 flex justify-center fade-in">
          <button
            onClick={() => onUpload(selectedFile)}
            disabled={isUploading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>✨ Generate Flashcards</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
