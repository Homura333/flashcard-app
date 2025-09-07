import type { FC } from "react";

interface ViewButtonsProps {
  /** JSONを貼付して読み込むボタンのハンドラー */
  onPasteJson: () => void;
  /** JSONをエクスポートするボタンのハンドラー */
  onExportJson: () => void;
  /** カードビューに切り替えるボタンのハンドラー */
  onShowCards: () => void;
  /** 対訳ノートビューに切り替えるボタンのハンドラー */
  onShowTranslationNotes: () => void;
  /** AIプロンプトビューに切り替えるボタンのハンドラー */
  onShowPrompt: () => void;
}

const ViewButtons: FC<ViewButtonsProps> = ({
  onPasteJson,
  onExportJson,
  onShowCards,
  onShowTranslationNotes,
  onShowPrompt,
}) => {
  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      <button onClick={onPasteJson} className="bg-blue-600 text-white px-4 py-2 rounded">
        生成/インポート（貼付）
      </button>
      <button onClick={onExportJson} className="bg-green-600 text-white px-4 py-2 rounded">
        JSONエクスポート
      </button>
      <button onClick={onShowCards} className="bg-purple-600 text-white px-4 py-2 rounded">
        カードを見る
      </button>
      <button
        onClick={onShowTranslationNotes}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        📚 対訳ノート
      </button>
      <button onClick={onShowPrompt} className="bg-gray-700 text-white px-4 py-2 rounded">
        💬 AI用プロンプト
      </button>
    </div>
  );
};

export default ViewButtons;
