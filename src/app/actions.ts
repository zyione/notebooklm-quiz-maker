"use server";

import { createClient } from "@/lib/supabase/server";
import { generateFlashcards } from "@/lib/gemini";
import { PDFParse } from "pdf-parse";

export async function uploadAndGenerate(formData: FormData) {
  const supabase = await createClient();

  // 1. Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // 2. Get the file from form data
  const file = formData.get("file") as File;
  if (!file || file.type !== "application/pdf") {
    throw new Error("Please upload a valid PDF file");
  }

  // 3. Upload to Supabase Storage
  const storagePath = `${user.id}/${Date.now()}_${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("pdfs")
    .upload(storagePath, file);

  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

  // 4. Create document record
  const { data: doc, error: docError } = await supabase
    .from("documents")
    .insert({
      user_id: user.id,
      filename: file.name,
      storage_path: storagePath,
    })
    .select()
    .single();

  if (docError) throw new Error(`DB error: ${docError.message}`);

  // 5. Parse PDF text
  const buffer = Buffer.from(await file.arrayBuffer());
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  const textResult = await parser.getText();
  await parser.destroy();
  const text = textResult.text;

  if (!text || text.trim().length < 50) {
    throw new Error(
      "Could not extract enough text from this PDF. It may be image-based or empty."
    );
  }

  // 6. Generate flashcards with Gemini
  const flashcards = await generateFlashcards(text);

  // 7. Insert flashcards into DB
  if (flashcards.length > 0) {
    const rows = flashcards.map((fc) => ({
      document_id: doc.id,
      user_id: user.id,
      front: fc.front,
      back: fc.back,
    }));

    const { error: fcError } = await supabase.from("flashcards").insert(rows);
    if (fcError) throw new Error(`Flashcard insert error: ${fcError.message}`);
  }

  return { documentId: doc.id, count: flashcards.length };
}

export async function getUserDocuments() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("documents")
    .select("id, filename, created_at")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getFlashcards(documentId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("flashcards")
    .select("id, front, back")
    .eq("document_id", documentId)
    .order("created_at", { ascending: true });

  return data ?? [];
}

export async function deleteDocument(documentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Get the storage path before deleting
  const { data: doc } = await supabase
    .from("documents")
    .select("storage_path")
    .eq("id", documentId)
    .single();

  if (doc?.storage_path) {
    await supabase.storage.from("pdfs").remove([doc.storage_path]);
  }

  // Cascade will delete flashcards too
  await supabase.from("documents").delete().eq("id", documentId);
}
