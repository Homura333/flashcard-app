export interface Flashcard {
  expression: string;
  meaning: string;
  part_of_speech: string;
  example: string;
  translation: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
}

export interface PhraseEntry {
  phrase: string;
  meaning: string;
  example: string;
}

export interface TranslationNote {
  id: string;
  original: string;
  translation: string;
  annotations: {
    phrase: string;
    explanation: string;
  }[];
}
