// src/test/DevPanel.tsx
import React from "react";
import { makeMultiDeck } from "./TestData";
import type { Flashcard } from "../components/types";

type Props = {
  setDecks: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedDeck: React.Dispatch<React.SetStateAction<string>>;
  setCards: React.Dispatch<React.SetStateAction<Flashcard[]>>;
  setView: (v: "menu" | "cards" | "prompt") => void;
  setMode: (m: "single" | "list") => void;
};

export default function DevPanel({ setDecks, setSelectedDeck, setCards, setView, setMode }: Props) {
  const seed = () => {
    const { decks, selectedDeck, cards } = makeMultiDeck();
    setDecks(decks);
    setSelectedDeck(selectedDeck);
    setCards(cards);
    console.log("[DevPanel] seeded", { decks, selectedDeck, cardsCount: cards.length });
    alert("テストデータ投入完了（重複警告が出ることがあります）");
  };

  const clearAll = () => {
    setDecks(["default"]);
    setSelectedDeck("default");
    setCards([
      { expression: "hello", meaning: "こんにちは", deckId: "default", part_of_speech: "", example: "", translation: "", category: "practical" },
    ]);
    localStorage.setItem("view", "menu");
    localStorage.setItem("selectedDeck", "default");
    localStorage.setItem("decks", JSON.stringify(["default"]));
    localStorage.setItem("cards", JSON.stringify([
      { expression: "hello", meaning: "こんにちは", deckId: "default", part_of_speech: "", example: "", translation: "", category: "practical" },
    ]));
    console.log("[DevPanel] reset to defaults");
    alert("初期状態にリセットしました");
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-4 border rounded bg-amber-50 p-3 text-sm">
      <div className="font-semibold mb-2">🧪 DevPanel（テスト用／モーダル不使用）</div>
      <div className="flex flex-wrap gap-2">
        <button className="px-3 py-1 rounded bg-amber-600 text-white hover:bg-amber-700" onClick={seed}>
          サンプル投入（複数デッキ）
        </button>
        <button className="px-3 py-1 rounded bg-gray-600 text-white hover:bg-gray-700" onClick={clearAll}>
          リセット
        </button>
        <button className="px-3 py-1 rounded bg-slate-700 text-white hover:bg-slate-800" onClick={() => setView("cards")}>
          カード画面へ
        </button>
        <button className="px-3 py-1 rounded bg-slate-500 text-white hover:bg-slate-600" onClick={() => setMode("single")}>
          単体モード
        </button>
        <button className="px-3 py-1 rounded bg-slate-500 text-white hover:bg-slate-600" onClick={() => setMode("list")}>
          リストモード
        </button>
      </div>
      <p className="mt-2 text-gray-700">※ 表示は常時画面上部。URL に <code>?dev=1</code> を付けるか、<code>localStorage.devPanel = "1"</code> で表示ONにできます。</p>
    </div>
  );
}
