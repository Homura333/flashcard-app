// src/components/CardsView.tsx
import React, { useEffect } from "react";
import type { Flashcard } from "./types";
import CardSingle from "./CardSingle";
import CardList from "./CardList";

type CardState = {
  currentIndex: number;
  flippedStates: boolean[];
  editingIndex: number | null;
  editedCard: Flashcard | null;
};

type Props = {
  visibleCards: Flashcard[];
  cardState: CardState;
  dispatch: React.Dispatch<any>;
  mode: "single" | "list";
  setMode: (mode: "single" | "list") => void;
  onBack: () => void;
  setCards: React.Dispatch<React.SetStateAction<Flashcard[]>>;
};

const CardsView: React.FC<Props> = ({
  visibleCards,
  cardState,
  dispatch,
  mode,
  setMode,
  onBack,
  setCards,
}) => {
  const total = visibleCards.length;
  const currentCard = visibleCards[cardState.currentIndex];

  useEffect(() => {
    if (visibleCards.length === 0) onBack();
  }, [visibleCards.length, onBack]);

  if (!currentCard) return null;

  const handleFlip = () => dispatch({ type: "toggleFlip", index: cardState.currentIndex });

  const goPrev = () =>
    dispatch({
      type: "setIndex",
      index: cardState.currentIndex - 1 >= 0 ? cardState.currentIndex - 1 : total - 1,
      resetFlip: true,
    });

  const goNext = () =>
    dispatch({
      type: "setIndex",
      index: cardState.currentIndex + 1 < total ? cardState.currentIndex + 1 : 0,
      resetFlip: true,
    });

  const handleEditCancel = () => dispatch({ type: "editCancel" });
  const handleEditSave = (idx: number, card: Flashcard) => {
    setCards((prev) => prev.map((c, i) => (i === idx ? card : c)));
    dispatch({ type: "editSave" });
  };
  const handleDelete = (idx: number) => {
    if (!confirm("このカードを削除しますか？")) return;
    setCards((prev) => prev.filter((_, i) => i !== idx));
    dispatch({ type: "editCancel" });
  };

  const handleFieldChange = (field: keyof Flashcard, value: string) => {
    if (cardState.editedCard) {
      dispatch({ type: "editFieldChange", field, value });
    }
  };

  const handleModeChange = (newMode: "single" | "list") => {
    setMode(newMode);
    dispatch({ type: "resetFlippedStates", length: visibleCards.length });
  };

  const progressPercent = total ? ((cardState.currentIndex + 1) / total) * 100 : 0;

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      {/* 上部ヘッダー */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700 transition"
        >
          ← メニューに戻る
        </button>

        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700">表示モード：</label>
          <select
            value={mode}
            onChange={(e) => handleModeChange(e.target.value as "single" | "list")}
            className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
          >
            <option value="single">単体表示</option>
            <option value="list">リスト表示</option>
          </select>
        </div>
      </div>

      {/* 単体表示 */}
      {mode === "single" && currentCard && (
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center">
          <CardSingle
            card={currentCard}
            flipped={cardState.flippedStates[cardState.currentIndex]}
            onFlip={handleFlip}
            onPrev={goPrev}
            onNext={goNext}
            hasPrev={total > 1}
            hasNext={total > 1}
          />

          {/* 進捗バー */}
          <div className="w-full max-w-md h-2 bg-gray-200 rounded-full mt-6">
            <div
              className="h-2 bg-blue-600 rounded-full transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-sm text-gray-600 mt-2">
            {cardState.currentIndex + 1} / {total}
          </div>
        </div>
      )}

      {/* 一覧表示 */}
      {mode === "list" && (
        <div className="bg-white shadow-md rounded-2xl p-6">
          <CardList
            cards={visibleCards}
            flippedStates={cardState.flippedStates}
            editingIndex={cardState.editingIndex}
            editedCard={cardState.editedCard}
            onToggle={(idx) => dispatch({ type: "toggleFlip", index: idx })}
            onEditStart={(idx, card) => dispatch({ type: "editStart", index: idx, card })}
            onEditCancel={handleEditCancel}
            onEditSave={handleEditSave}
            onDelete={handleDelete}
            onFieldChange={handleFieldChange}
          />
        </div>
      )}
    </div>
  );
};

export default CardsView;
