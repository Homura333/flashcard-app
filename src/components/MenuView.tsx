// src/components/MenuView.tsx
import React from "react";
import DeckManager from "./DeckManager";
import type { Flashcard } from "./types";

type Props = {
  decks: string[];
  selectedDeck: string;
  cards: Flashcard[];
  onSelectDeck: (deck: string) => void;
  onAddDeck: (name: string) => void;
  onDeleteDeck: (deck: string) => void;
  onRenameDeck: (oldName: string, newName: string) => void;
  jsonInput: string;
  setJsonInput: (val: string) => void;
  onPasteJson: () => void;
  onExportJson: () => void;
  onShowCards: () => void;
  onShowPrompt: () => void;
};

const MenuView: React.FC<Props> = ({
  decks,
  selectedDeck,
  cards,
  onSelectDeck,
  onAddDeck,
  onDeleteDeck,
  onRenameDeck,
  jsonInput,
  setJsonInput,
  onPasteJson,
  onExportJson,
  onShowCards,
  onShowPrompt,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      {/* タイトル */}
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        英語フレーズ暗記カード
      </h2>

      {/* デッキ管理 */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">デッキ管理</h3>
        <DeckManager
          decks={decks}
          selectedDeck={selectedDeck}
          cards={cards}
          onSelect={onSelectDeck}
          onAdd={onAddDeck}
          onDelete={onDeleteDeck}
          onRename={onRenameDeck}
        />
      </div>

      {/* JSON操作 */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">データのインポート / エクスポート</h3>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="ここにJSONを貼り付けてください"
          className="border border-gray-300 p-3 rounded-lg w-full h-96 resize-both overflow-auto focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <div className="mt-4 flex gap-3 flex-wrap">
          <button
            onClick={onPasteJson}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            JSON読み込み
          </button>
          <button
            onClick={onExportJson}
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
          >
            JSON書き出し
          </button>
        </div>
      </div>

      {/* ビュー切替 */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={onShowCards}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          カード表示
        </button>
        <button
          onClick={onShowPrompt}
          className="bg-gray-700 text-white px-6 py-3 rounded-lg shadow hover:bg-gray-800 transition"
        >
          プロンプト
        </button>
      </div>
    </div>
  );
};

export default MenuView;
