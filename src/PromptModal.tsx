import React, { useState } from 'react';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const cardPrompt = `[
  {
    "expression": "break the ice",
    "meaning": "to start a conversation in a social setting",
    "part_of_speech": "idiom",
    "example": "He told a joke to break the ice.",
    "translation": "場の雰囲気を和ませる"
  }
]`;

const notePrompt = `[
  {
    "original": "I’m starving.",
    "translation": "お腹ぺこぺこ。",
    "annotations": [
      { "phrase": "starving", "explanation": "ひどく空腹な、飢えている" }
    ]
  }
]`;

export const PromptModal: React.FC<PromptModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'card' | 'note'>('card');

  if (!isOpen) return null;

  const promptText = activeTab === 'card' ? cardPrompt : notePrompt;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    alert("📋 コピーしました！");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-xl p-6">
        <h2 className="text-xl font-bold mb-4">💡 AI用プロンプト</h2>

        {/* タブ切替 */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('card')}
            className={`px-3 py-1 rounded ${activeTab === 'card' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            📇 カード用
          </button>
          <button
            onClick={() => setActiveTab('note')}
            className={`px-3 py-1 rounded ${activeTab === 'note' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            📚 ノート用
          </button>
        </div>

        {/* プロンプト表示 */}
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap">{promptText}</pre>

        <div className="flex justify-end mt-4 gap-2">
          <button onClick={handleCopy} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            📋 コピー
          </button>
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
