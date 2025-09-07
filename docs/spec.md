````markdown
# 📑 英語フレーズ暗記カードアプリ 実装仕様書（開発者向け）

## 1. アプリ概要
- **目的**: ポッドキャストや動画のトランスクリプトから、AIを用いて暗記カードを自動生成する。  
- **特徴**:
  - JSONインポートでカードを一括作成  
  - デッキ単位で管理（追加・削除・名称変更）  
  - 単体表示／一覧表示でカード学習  
  - テキストを分割して ChatGPT 用プロンプトを生成  

---

## 2. データ仕様

### Flashcard 型定義
```ts
export interface Flashcard {
  expression: string;     // 単語・フレーズ
  meaning: string;        // 意味（英語）
  part_of_speech: string; // 品詞
  example: string;        // 英語例文
  translation: string;    // 日本語訳
  category: "practical" | "literary"; // 分類
  deckId: string;         // デッキID（インポート時自動付与）
}
````

### デッキ管理

* デッキは文字列 ID で一意に管理（例: `"Day1"`, `"Travel"`）
* `deckId` によりカードとの関連を保持

### JSONフォーマット例

```json
[
  {
    "expression": "mysterious lights",
    "meaning": "lights that are strange or unexplained",
    "part_of_speech": "noun phrase",
    "example": "We saw mysterious lights moving quickly across the night sky.",
    "translation": "私たちは夜空を素早く移動する謎の光を見た。",
    "category": "literary"
  }
]
```

---

## 3. 画面仕様

### 3-1. MenuView

**機能**: デッキ管理、JSON入出力、画面遷移

**UI要素**:

* デッキ一覧（ドロップダウン or リスト）
* JSON入力欄（textarea）
* JSON読み込み／書き出しボタン
* 「カード表示」ボタン
* 「プロンプト生成」ボタン

**主要処理**:

* `onDeckSelect(deckId: string)`
* `onDeckAdd(name: string)`
* `onDeckRename(oldName: string, newName: string)`
* `onDeckDelete(deckId: string)`
* `onJsonImport()`
* `onJsonExport(deckId: string)`
* `onNavigate("cards" | "prompt")`

---

### 3-2. CardsView

**機能**: カード表示・編集・削除

**モード**:

* 単体表示（CardSingle）
* 一覧表示（CardList）

**UI要素**:

* ヘッダー（戻る／表示切替）
* カード本体（表裏反転、例文表示）
* 編集ボタン／削除ボタン
* 進捗バー

**主要処理**:

* `onFlip()`
* `onPrev() / onNext()`
* `onToggle(idx: number)`
* `onEditStart(idx: number, card: Flashcard)`
* `onEditSave(idx: number, edited: Flashcard)`
* `onEditCancel()`
* `onDelete(idx: number)`

---

### 3-3. PromptView

**機能**: 文章を分割してプロンプト生成

**UI要素**:

* 入力欄（textarea）
* 自動分割ボタン
* 編集エリア（黄色バー表示、D\&D操作可能）
* プロンプト一覧（PromptBlock）
* 保存ボタン

**主要処理**:

* `onTextChange(text: string)`
* `onSplit(minWords?: number, maxWords?: number)`
* `onDrop(e: DragEvent)`
* `onGeneratePrompt(block: string)`
* `onSave()`

---

## 4. 状態管理（React Hooks）

### 共通

```ts
const [view, setView] = useState<"menu" | "cards" | "prompt">("menu");
const [decks, setDecks] = useState<string[]>([]);
const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
const [cards, setCards] = useState<Flashcard[]>([]);
```

### CardsView

```ts
const [mode, setMode] = useState<"single" | "list">("single");
const [currentIndex, setCurrentIndex] = useState<number>(0);
const [flippedStates, setFlippedStates] = useState<boolean[]>([]);
const [editingIndex, setEditingIndex] = useState<number | null>(null);
const [editedCard, setEditedCard] = useState<Flashcard | null>(null);
```

### PromptView

```ts
const [text, setText] = useState<string>("");
const [markers, setMarkers] = useState<number[]>([]);
const [dragIndex, setDragIndex] = useState<number | null>(null);
```

---

## 5. 共通ユーティリティ

* `sliceSentencesWithOffsets(text: string)` → 文末記号で分割
* `splitBySentenceAndWordCount(text, min, max)` → 自然な文ブロック生成
* `generateFlashcardPrompt(chunk: string)` → ChatGPT用プロンプト生成
* `savePromptsToFile(data: any)` → JSON保存

---

## 6. 制約・補足

* JSON必須項目（expression, meaning, example）が無い場合はエラー
* デッキIDは重複不可
* カード0枚時は自動でMenuViewへ戻る
* 編集・削除は確認ダイアログを表示
* 大量カード対応: 表示件数制限やスクロールでパフォーマンス確保

```


