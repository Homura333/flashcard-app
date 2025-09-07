// types.ts

export interface Flashcard {
  expression: string;     // 単語 or フレーズ
  meaning: string;        // 意味（英語での意味）
  part_of_speech: string; // 品詞
  example: string;        // 英語例文
  translation: string;    // 例文の日本語訳
  category: "practical" | "literary"; // ← ChatGPT が出力する
  deckId: string;         // インポート時に自動で付与される
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
