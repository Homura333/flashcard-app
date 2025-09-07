import { useState } from "react";
import PromptBlock from "./PromptBlock";
import { savePromptsToFile } from "./savePrompts";

/** 文章を「句点/終端記号」ごとの塊として、原文の start/end を保持して抽出 */
function sliceSentencesWithOffsets(text: string) {
  const re = /.*?[.!?。！？](?:\s+|$)/gs;
  const chunks: { start: number; end: number; text: string; words: number }[] = [];
  let m: RegExpExecArray | null;
  let lastEnd = 0;

  while ((m = re.exec(text)) !== null) {
    const seg = m[0];
    const start = m.index;
    const end = start + seg.length;
    const words = (seg.trim().match(/\b[\w'-]+\b/g) || []).length;
    chunks.push({ start, end, text: seg, words });
    lastEnd = end;
  }
  if (lastEnd < text.length) {
    const seg = text.slice(lastEnd);
    const words = (seg.trim().match(/\b[\w'-]+\b/g) || []).length;
    chunks.push({ start: lastEnd, end: text.length, text: seg, words });
  }
  return chunks;
}

/** 文＋単語数ハイブリッドで分割ポイント(原文オフセット)を返す */
function splitBySentenceAndWordCount(
  text: string,
  minWords = 250,
  maxWords = 400
): number[] {
  const sents = sliceSentencesWithOffsets(text);
  const markers: number[] = [];
  let acc = 0;
  let lastEnd = 0;

  for (const s of sents) {
    if (acc + s.words > maxWords && acc >= minWords) {
      markers.push(lastEnd);
      acc = 0;
    }
    acc += s.words;
    lastEnd = s.end;
  }
  return sanitizeMarkers(markers, text.length);
}

function sanitizeMarkers(arr: number[], textLen: number) {
  const uniq = Array.from(new Set(arr.map((n) => Math.min(Math.max(n, 1), textLen - 1))));
  uniq.sort((a, b) => a - b);
  return uniq;
}

/** クリック座標から Range を得る */
function caretRangeFromPointSafe(x: number, y: number): Range | null {
  const doc = document as Document & {
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
    caretPositionFromPoint?: (
      x: number,
      y: number
    ) => { offsetNode: Node; offset: number } | null;
  };

  if (doc.caretRangeFromPoint) {
    return doc.caretRangeFromPoint(x, y);
  }
  if (doc.caretPositionFromPoint) {
    const pos = doc.caretPositionFromPoint(x, y);
    if (!pos) return null;
    const r = document.createRange();
    r.setStart(pos.offsetNode, pos.offset);
    r.collapse(true);
    return r;
  }
  return null;
}

interface PromptViewProps {
  setView: (view: "menu" | "prompt" | "cards") => void;
}

export default function PromptView({ setView }: PromptViewProps) {
  const [text, setText] = useState("");
  const [markers, setMarkers] = useState<number[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleSplit = () => setMarkers(splitBySentenceAndWordCount(text));

  const renderWithMarkers = () => {
    const parts: React.ReactElement[] = [];
    let last = 0;

    markers.forEach((pos, i) => {
      parts.push(
        <span key={`t-${i}`} data-start={last} data-end={pos}>
          {text.slice(last, pos)}
        </span>
      );
      parts.push(
        <div
          key={`m-${i}`}
          className="bg-yellow-300/80 border border-yellow-500 text-yellow-900 text-center font-bold my-3 py-1 rounded cursor-move select-none"
          draggable
          onDragStart={(e) => {
            setDragIndex(i);
            e.dataTransfer.setData("text/plain", "BLOCK");
            e.dataTransfer.effectAllowed = "move";
          }}
        >
          ————  BLOCK  ————
        </div>
      );
      last = pos;
    });

    parts.push(
      <span key="t-last" data-start={last} data-end={text.length}>
        {text.slice(last)}
      </span>
    );
    return parts;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dragIndex === null) return;

    const range = caretRangeFromPointSafe(e.clientX, e.clientY);
    if (!range) return;

    let absolute = 0;
    if (range.startContainer.nodeType === Node.TEXT_NODE) {
      const parent = (range.startContainer as Text).parentElement;
      const span = parent?.closest("[data-start]") as HTMLElement | null;
      const base = span?.getAttribute("data-start");
      const baseNum = base ? parseInt(base, 10) : 0;
      absolute = baseNum + range.startOffset;
    } else {
      const container = e.currentTarget;
      const spans = Array.from(container.querySelectorAll<HTMLElement>("[data-start]"));
      let candidate: HTMLElement | null = null;
      let bestDy = Infinity;
      for (const s of spans) {
        const r = s.getBoundingClientRect();
        const dy =
          e.clientY < r.top ? r.top - e.clientY :
          e.clientY > r.bottom ? e.clientY - r.bottom : 0;
        if (dy < bestDy) {
          bestDy = dy;
          candidate = s;
        }
      }
      if (candidate) {
        const endAttr = candidate.getAttribute("data-end");
        absolute = endAttr ? parseInt(endAttr, 10) : text.length;
      } else {
        absolute = text.length;
      }
    }

    const sanitized = sanitizeMarkers(
      Object.assign([...markers], { [dragIndex]: absolute }),
      text.length
    );
    setMarkers(sanitized);
    setDragIndex(null);
  };

  const getBlocksFromText = (): string[] => {
    if (!markers.length) return [text.trim()].filter(Boolean);
    const out: string[] = [];
    let last = 0;
    for (const pos of markers) {
      out.push(text.slice(last, pos));
      last = pos;
    }
    out.push(text.slice(last));
    return out.map((s) => s.trim()).filter(Boolean);
  };

  /** 最終形プロンプト */
  const generateFlashcardPrompt = (chunk: string) => `
  以下の英文から、学習価値のある単語やフレーズを抽出してください。
  簡単すぎる語彙（例: book, pen, cat, run など）は含めないでください。

  各語彙は practical（実用的・日常会話でよく使う）または literary（文学的・特殊表現）に分類してください。

  抽出した各項目は必ず以下のJSON形式で出力してください。
  余計な説明やテキストは書かず、JSON配列のみを返してください。

  JSONの形式:
  [
    {
      "expression": "string (単語やフレーズ)",
      "meaning": "string (英語での意味)",
      "part_of_speech": "string (品詞)",
      "example": "string (自然な英語例文)",
      "translation": "string (例文の自然な日本語訳)",
      "category": "practical" | "literary"
    }
  ]

  文章:
  ${chunk}`;

  const handleSave = () => {
    const blocks = getBlocksFromText();
    const prompts: string[] = blocks.map((chunk) =>
      generateFlashcardPrompt(chunk)
    );
    savePromptsToFile(prompts);
  };

  return (
    <div className="w-full max-w-4xl bg-white p-6 rounded shadow space-y-6">
      <h2 className="text-2xl font-bold">ChatGPT用プロンプト</h2>
      <p className="text-sm text-gray-700">
        「自動分割」で <code>BLOCK</code> マーカーを挿入。マーカーは黄色バーで表示され、ドラッグ&ドロップで文途中でも移動できます。
      </p>

      {/* 入力欄 */}
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setMarkers([]);
        }}
        placeholder="ここに文章を入力..."
        className="w-full h-48 p-2 border rounded font-mono"
      />

      <div className="flex gap-2">
        <button onClick={handleSplit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          自動分割
        </button>
        <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          💾 プロンプトを保存
        </button>
      </div>

      {/* 編集エリア */}
      <div
        className="border rounded p-3 min-h-[100px] font-mono whitespace-pre-wrap"
        contentEditable={false}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {renderWithMarkers()}
      </div>

      {/* プロンプト一覧 */}
      {getBlocksFromText().length > 0 && (
        <div className="space-y-6 mt-6">
          {getBlocksFromText().map((chunk, idx) => (
            <div key={idx} className="border p-2 rounded bg-gray-50 space-y-4">
              <PromptBlock
                title={`🧠 抽出プロンプト (${idx + 1})`}
                prompt={generateFlashcardPrompt(chunk)}
                disabled={!chunk.trim()}
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-start mt-6">
        <button onClick={() => setView("menu")} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
          メニューに戻る
        </button>
      </div>
    </div>
  );
}
