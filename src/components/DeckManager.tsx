import { useState } from "react";
import type { Flashcard } from "./types";

interface Props {
  decks: string[];
  selectedDeck: string;
  cards: Flashcard[];
  onSelect: (deck: string) => void;
  onAdd: (name: string) => void;
  onDelete: (deck: string) => void;
  onRename: (oldName: string, newName: string) => void;
}

export default function DeckManager({
  decks,
  selectedDeck,
  cards,
  onSelect,
  onAdd,
  onDelete,
  onRename,
}: Props) {
  const [editingDeck, setEditingDeck] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");

  const getDeckCardCount = (deck: string) => cards.filter((c) => c.deckId === deck).length;

  return (
    <div className="mb-2 w-full">
      <label htmlFor="deck-select" className="mr-2">デッキ選択:</label>
      <select
        id="deck-select"
        value={selectedDeck || (decks[0] ?? "")}
        onChange={(e) => onSelect(e.target.value)}
        className="border rounded px-2 py-1"
      >
        {decks.map((deck) => (
          <option key={deck} value={deck}>
            {deck} ({getDeckCardCount(deck)}枚)
          </option>
        ))}
      </select>

      <div className="mt-2 flex flex-col gap-1">
        {decks.map((deck) => (
          <div key={deck} className="flex items-center gap-2">
            {editingDeck === deck ? (
              <>
                <input
                  className="border px-2 py-1 rounded"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (tempName.trim()) {
                        onRename(deck, tempName.trim());
                        setEditingDeck(null);
                      }
                    } else if (e.key === "Escape") {
                      setEditingDeck(null);
                    }
                  }}
                  autoFocus
                />
                <button
                  className="bg-gray-600 text-white px-2 py-1 rounded"
                  onClick={() => setEditingDeck(null)}
                >
                  キャンセル
                </button>
              </>
            ) : (
              <>
                <span className="flex-1">
                  {deck} ({getDeckCardCount(deck)}枚)
                </span>
                <button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                  onClick={() => {
                    setEditingDeck(deck);
                    setTempName(deck);
                  }}
                >
                  リネーム
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                  onClick={() => {
                    if (confirm(`「${deck}」を削除しますか？`)) onDelete(deck);
                  }}
                >
                  🗑 削除
                </button>
              </>
            )}
          </div>
        ))}

        <button
          onClick={() => {
            const name = (prompt("新しいデッキ名を入力してください") || "").trim();
            if (name) onAdd(name);
          }}
          className="mt-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
        >
          ＋新規デッキ
        </button>
      </div>
    </div>
  );
}
