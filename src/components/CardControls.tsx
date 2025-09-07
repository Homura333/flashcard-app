import type { FC } from "react";

interface CardControlsProps {
  /** メニューに戻るボタンのハンドラー */
  onBackToMenu: () => void;
  /** 現在の表示モード */
  mode: "single" | "list";
  /** モード切替ボタンのハンドラー */
  onToggleMode: () => void;
}

const CardControls: FC<CardControlsProps> = ({ onBackToMenu, mode, onToggleMode }) => {
  return (
    <div className="flex justify-between w-full mb-4 gap-2 flex-wrap">
      <button onClick={onBackToMenu} className="bg-gray-600 text-white px-4 py-2 rounded">
        メニュー
      </button>
      <button onClick={onToggleMode} className="bg-gray-800 text-white px-4 py-2 rounded">
        モード切替: {mode === "single" ? "一覧" : "1枚"}
      </button>
    </div>
  );
};

export default CardControls;
