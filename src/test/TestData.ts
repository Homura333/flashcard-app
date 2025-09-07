// src/test/TestData.ts
import type { Flashcard } from "../components/types";

export function makeCards(deckId: string): Flashcard[] {
  return [
    { expression: "take it for granted", meaning: "assume without proof", deckId, part_of_speech: "phrase", example: "Don't take it for granted.", translation: "当たり前だと思わないで。", category: "practical" },
    { expression: "meticulous", meaning: "very careful and precise", deckId, part_of_speech: "adj", example: "She is meticulous about her notes.", translation: "彼女はノートを几帳面に取る。", category: "literary" },
    { expression: "fall short", meaning: "fail to reach", deckId, part_of_speech: "phrase", example: "The results fell short of expectations.", translation: "結果は期待に届かなかった。", category: "practical" },
    { expression: "ubiquitous", meaning: "found everywhere", deckId, part_of_speech: "adj", example: "Smartphones are ubiquitous now.", translation: "今やスマホは至る所にある。", category: "literary" },
    { expression: "alleviate", meaning: "make less severe", deckId, part_of_speech: "verb", example: "This medicine alleviates pain.", translation: "この薬は痛みを和らげる。", category: "practical" },
    // 意図的な重複（デッキ内重複警告の確認用）
    { expression: "meticulous", meaning: "very careful and precise", deckId, part_of_speech: "adj", example: "Meticulous planning is key.", translation: "綿密な計画が鍵だ。", category: "literary" },
  ];
}

export function makeMultiDeck() {
  return {
    decks: ["default", "news"],
    selectedDeck: "default",
    cards: [
      ...makeCards("default"),
      ...[
        { expression: "headline", meaning: "title of a news article", deckId: "news", part_of_speech: "noun", example: "The headline drew attention.", translation: "その見出しは注目を集めた。", category: "practical" },
        { expression: "censor", meaning: "suppress speech", deckId: "news", part_of_speech: "verb", example: "They tried to censor the report.", translation: "彼らは報告を検閲しようとした。", category: "literary" },
      ],
    ] as Flashcard[],
  };
}
