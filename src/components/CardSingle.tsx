// CardSingle.tsx
import type { Flashcard } from "./types";

type Props = {
  card: Flashcard;
  flipped: boolean;
  onFlip: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
};

export default function CardSingle({
  card,
  flipped,
  onFlip,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}: Props) {
  return (
    <div className="flex flex-col items-center">
      <div
        onClick={onFlip}
        className="cursor-pointer w-full max-w-md p-6 border rounded-2xl shadow-lg bg-white text-center mb-4"
        style={{ minHeight: "300px" }}
      >
        {!flipped ? (
          <p className="text-3xl font-bold text-blue-700 tracking-wide">
            {card.expression}
          </p>
        ) : (
          <div className="text-base text-gray-800 space-y-2">
            <p>
              <strong>意味:</strong> {card.meaning}
            </p>
            {card.part_of_speech && (
              <p>
                <strong>品詞:</strong> {card.part_of_speech}
              </p>
            )}
            <p>
              <strong>カテゴリ:</strong> {(card as any).category ?? "—"}
            </p>
            <p>
              <strong>例文:</strong> <em>{card.example}</em>
            </p>
            <p>
              <strong>和訳:</strong> {card.translation}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={onPrev}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700 disabled:opacity-50"
          disabled={!hasPrev}
        >
          ◀ 前へ
        </button>

        <button
          onClick={onNext}
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 disabled:opacity-50"
          disabled={!hasNext}
        >
          次へ ▶
        </button>
      </div>
    </div>
  );
}
