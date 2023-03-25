import * as Quiz from "@Core/app/quiz/change";

export default async function onNoteUpdate(note) {
  return Quiz.changeNote(note);
}
