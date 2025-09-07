```markdown
# 📑 英語フレーズ暗記カードアプリ 実装仕様書（開発者向け）

## 1. アプリ概要
- **目的**: ポッドキャストや動画のトランスクリプトから、AIを用いて暗記カードを自動生成する。  
- **特徴**:
  - JSONインポートでカードを一括作成  
  - デッキ単位で管理（追加・削除・名称変更）  
  - 単体表示／一覧表示でカード学習  
  - テキストを分割して ChatGPT 用プロンプトを生成  

---

## 2. ディレクトリ構成
```

src/
├── App.tsx              # ルートコンポーネント
├── main.tsx             # エントリーポイント
├── components/
│   ├── MenuView\.tsx     # メニュー画面
│   ├── CardsView\.tsx    # カード表示画面
│   ├── CardSingle.tsx   # 単体カード表示
│   ├── CardList.tsx     # 一覧カード表示
│   ├── CardControls.tsx # 単体表示の操作UI
│   ├── ViewButtons.tsx  # ビュー切替UI
│   ├── DeckManager.tsx  # デッキ管理UI
│   ├── PromptView\.tsx   # プロンプト生成画面
│   ├── PromptBlock.tsx  # プロンプトブロック表示
│   ├── PromptModal.tsx  # プロンプト関連モーダル（補助機能）
│   ├── TranslationNotes.tsx # 翻訳ノート表示（補助機能）
│   ├── savePrompts.ts   # プロンプト保存ユーティリティ
│   └── types.ts         # 型定義（Flashcard, Deck 等）
├── hooks/
│   └── useLocalStorage.ts # LocalStorage 永続化フック
├── reducers/
│   └── cardReducer.ts     # カード状態管理のReducer
├── utils/
│   └── cardUtils.ts       # カード操作ユーティリティ
└── test/                  # 各コンポーネント/ユーティリティのテスト

````

---

## 3. データ仕様

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

## 4. 画面仕様

### 4-1. MenuView

* **機能**: デッキ管理、JSON入出力、画面遷移
* **補助コンポーネント**: `DeckManager`, `ViewButtons`
* **イベント**:

  * `onDeckSelect(deckId)`
  * `onDeckAdd(name)`
  * `onDeckRename(oldName, newName)`
  * `onDeckDelete(deckId)`
  * `onJsonImport() / onJsonExport(deckId)`
  * `onNavigate("cards" | "prompt")`

---

### 4-2. CardsView

* **機能**: カード表示・編集・削除
* **モード**: 単体表示（`CardSingle`）／一覧表示（`CardList`）
* **補助コンポーネント**: `CardControls`, `ViewButtons`
* **イベント**:

  * `onFlip()`, `onPrev()`, `onNext()`
  * `onToggle(idx)`
  * `onEditStart(idx, card)`
  * `onEditSave(idx, editedCard)`
  * `onEditCancel()`
  * `onDelete(idx)`

---

### 4-3. PromptView

* **機能**: 文章分割 & プロンプト生成
* **補助コンポーネント**: `PromptBlock`, `PromptModal`
* **イベント**:

  * `onTextChange(text)`
  * `onSplit(minWords?, maxWords?)`
  * `onDrop(e: DragEvent)`
  * `onGeneratePrompt(block)`
  * `onSave()`

---

### 4-4. TranslationNotes

* **機能**: 学習用に翻訳メモを表示する補助機能
* **仕様書未記載 → 今回追加**

---

## 5. 状態管理

### 共通

```ts
view: "menu" | "cards" | "prompt"
decks: string[]
selectedDeck: string | null
cards: Flashcard[]
```

### CardsView

```ts
mode: "single" | "list"
currentIndex: number
flippedStates: boolean[]
editingIndex: number | null
editedCard: Flashcard | null
```

### PromptView

```ts
text: string
markers: number[]
dragIndex: number | null
```

### Reducer

* `cardReducer.ts`: カード追加／削除／編集を一元管理

### Hook

* `useLocalStorage.ts`: デッキ・カードをLocalStorageに永続化

---

## 6. ユーティリティ

* `splitByWords.ts`: テキスト分割（文＋単語数）
* `cardUtils.ts`: カード配列の検索・更新処理
* `savePrompts.ts`: プロンプトをJSONとして保存

---

## 7. 制約・補足

* JSON必須項目（expression, meaning, example）が無い場合はエラー
* デッキIDは重複不可
* カード0枚時は自動でMenuViewへ戻る
* 編集・削除は確認ダイアログを表示
* 大量カード対応: 表示件数制限やスクロールでパフォーマンス確保

---

## 8. テスト

* `test/` 以下に各コンポーネントとユーティリティの単体テストあり
* 主に以下をカバー:

  * デッキ操作（DeckManager.test.tsx）
  * カード操作（CardList.test.tsx, CardSingle.test.tsx）
  * 状態管理（cardReducer.test.ts）
  * プロンプト生成（PromptView\.test.tsx, savePrompts.test.ts）
  * LocalStorage処理（useLocalStorage.test.tsx）

```
