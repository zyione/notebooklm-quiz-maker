import QuizClient from "./QuizClient";
import { getFlashcards } from "@/app/actions";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;
  const flashcards = await getFlashcards(documentId);

  return <QuizClient flashcards={flashcards} documentId={documentId} />;
}
