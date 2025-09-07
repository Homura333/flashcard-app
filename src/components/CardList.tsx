// CardList.tsx
import type { Flashcard } from "./types";

type Props = {
  cards: Flashcard[];
  flippedStates: boolean[];
  editingIndex: number | null;
  editedCard: Flashcard | null;
  onToggle: (visibleIdx: number) => void;
  onEditStart: (visibleIdx: number, card: Flashcard) => void;
  onEditCancel: () => void;
  onEditSave: (visibleIdx: number, card: Flashcard) => void;
  onDelete: (visibleIdx: number) => void;
  onFieldChange: (field: keyof Flashcard, value: string) => void;
};

export default function CardList({
  cards,
  flippedStates,
  editingIndex,
  editedCard,
  onToggle,
  onEditStart,
  onEditCancel,
  onEditSave,
  onDelete,
  onFieldChange,
}: Props) {
  return (
    <div className="w-full space-y-4">
      {cards.map((card, idx) => (
        <div
          key={`${idx}-${card.expression}`}
          className="p-6 border rounded-2xl shadow-md bg-white cursor-pointer transition-all duration-200 hover:shadow-lg"
          onClick={() => onToggle(idx)}
        >
          {/* 表面 */}
          <p className="text-xl font-semibold text-blue-700">{card.expression}</p>

          {/* 裏面 */}
          {flippedStates[idx] && (
            <>
              {editingIndex === idx && editedCard ? (
                <div className="space-y-2 mt-4" onClick={(e) => e.stopPropagation()}>
                  {(
                    ["expression", "meaning", "part_of_speech", "example", "translation", "category"] as (keyof Flashcard)[]
                  ).map((field) => (
                    <input
                      key={String(field)}
                      type="text"
                      value={(editedCard as any)?.[field] ?? ""}
                      onChange={(e) => onFieldChange(field, e.target.value)}
                      placeholder={String(field)}
                      className="w-full p-2 border rounded"
                    />
                  ))}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onEditSave(idx, editedCard); }}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      保存
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onEditCancel(); }}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-800 space-y-1 mt-4">
                  <p><strong>意味:</strong> {card.meaning}</p>
                  {card.part_of_speech && <p><strong>品詞:</strong> {card.part_of_speech}</p>}
                  <p><strong>カテゴリ:</strong> {(card as any).category ?? "—"}</p>
                  <p><strong>例文:</strong> <em>{card.example}</em></p>
                  <p><strong>和訳:</strong> {card.translation}</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                      onClick={(e) => { e.stopPropagation(); onEditStart(idx, card); }}
                    >
                      編集
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={(e) => { e.stopPropagation(); onDelete(idx); }}
                    >
                      削除
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
