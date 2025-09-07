// src/utils/cardUtils.ts
import type { Flashcard } from "../components/types";

/**
 * JSON文字列から Flashcard 配列を安全に取得する
 */
export function parseFlashcards(json: string, defaultDeckId: string): Flashcard[] {
  if (!json.trim()) return [];

  try {
    const normalized = json.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
    const parsedRaw = JSON.parse(normalized);

    const parsed: any[] = Array.isArray(parsedRaw)
      ? parsedRaw
      : Array.isArray(parsedRaw.cards)
        ? parsedRaw.cards
        : [];

    const cards: Flashcard[] = parsed
      .filter(c => c.expression && c.meaning)
      .map(c => ({
        expression: c.expression || "",
        meaning: c.meaning || "",
        deckId: c.deckId || defaultDeckId,
        part_of_speech: c.part_of_speech || "",
        example: c.example || "",
        translation: c.translation || "",
        category: c.category === "literary" ? "literary" : "practical",
      }));

    // デッキ内で重複 expression があるかチェック
    const seen: Record<string, boolean> = {};
    const duplicates: string[] = [];
    cards.forEach(c => {
      if (c.deckId === defaultDeckId) {
        if (seen[c.expression]) duplicates.push(c.expression);
        else seen[c.expression] = true;
      }
    });

    if (duplicates.length) {
      alert(
        `同じデッキ内で重複するカードがあります: ${[...new Set(duplicates)].join(", ")}`
      );
    }

    return cards;
  } catch (err) {
    console.error("Invalid JSON:", err);
    alert("JSONが不正です");
    return [];
  }
}

/**
 * Flashcard 配列を JSON 文字列に変換してダウンロード
 * deckName が未指定なら全カードをまとめて出力
 */
export function exportFlashcards(cards: Flashcard[], deckName?: string) {
  if (!cards.length) return alert("カードがありません");

  const fileName = deckName ? `${deckName}_cards.json` : "all_decks_cards.json";
  const blob = new Blob([JSON.stringify(cards, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
