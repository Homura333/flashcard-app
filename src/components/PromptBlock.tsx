interface PromptBlockProps {
  title: string;
  prompt: string;
  disabled?: boolean;
}

export default function PromptBlock({ title, prompt, disabled }: PromptBlockProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <div className="relative">
        <textarea
          readOnly
          value={prompt}
          className="w-full h-48 p-3 border rounded font-mono text-sm"
        />
        <div className="flex gap-2 mt-2">
          <button
            disabled={disabled}
            className={`bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => !disabled && navigator.clipboard.writeText(prompt)}
          >
            📋 コピー
          </button>
          <a
            href="https://chat.openai.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={`bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded ${
              disabled ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            ChatGPTで開く
          </a>
        </div>
      </div>
    </div>
  );
}
