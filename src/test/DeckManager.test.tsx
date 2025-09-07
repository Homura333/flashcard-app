// src/test/DeckManager.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import DeckManager from "../components/DeckManager";

describe("DeckManager Component", () => {
  const mockOnSelect = jest.fn();
  const mockOnAdd = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnRename = jest.fn();

  const decks = ["英単語", "フレーズ"];
  const selectedDeck = "英単語";
  const cards = [
    { deckId: "英単語", expression: "apple", meaning: "りんご", part_of_speech: "名詞", example: "I eat an apple.", translation: "私はりんごを食べます。" },
    { deckId: "フレーズ", expression: "Good morning", meaning: "おはよう", part_of_speech: "挨拶", example: "", translation: "" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -------------------------------
  // 既存のテスト
  // -------------------------------
  test("デッキが正しく表示される", () => {
    render(
      <DeckManager
        decks={decks}
        selectedDeck={selectedDeck}
        cards={cards}
        onSelect={mockOnSelect}
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onRename={mockOnRename}
      />
    );

    expect(screen.getByRole("option", { name: "英単語 (1枚)" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "フレーズ (1枚)" })).toBeInTheDocument();
    expect(screen.getAllByText("リネーム").length).toBeGreaterThan(0);
    expect(screen.getAllByText("🗑 削除").length).toBeGreaterThan(0);
  });

  test("デッキ選択を変更すると onSelect が呼ばれる", () => {
    render(
      <DeckManager
        decks={decks}
        selectedDeck={selectedDeck}
        cards={cards}
        onSelect={mockOnSelect}
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onRename={mockOnRename}
      />
    );

    fireEvent.change(screen.getByLabelText("デッキ選択:"), { target: { value: "フレーズ" } });
    expect(mockOnSelect).toHaveBeenCalledWith("フレーズ");
  });

  test("新規デッキ作成ボタンをクリックすると onAdd が呼ばれる", () => {
    window.prompt = jest.fn().mockReturnValue("新デッキ");

    render(
      <DeckManager
        decks={decks}
        selectedDeck={selectedDeck}
        cards={cards}
        onSelect={mockOnSelect}
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onRename={mockOnRename}
      />
    );

    fireEvent.click(screen.getByText("＋新規デッキ"));
    expect(mockOnAdd).toHaveBeenCalledWith("新デッキ");
  });

  test("デッキ削除ボタンをクリックすると onDelete が呼ばれる", () => {
    window.confirm = jest.fn().mockReturnValue(true);

    render(
      <DeckManager
        decks={decks}
        selectedDeck={selectedDeck}
        cards={cards}
        onSelect={mockOnSelect}
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onRename={mockOnRename}
      />
    );

    fireEvent.click(screen.getAllByText("🗑 削除")[0]);
    expect(mockOnDelete).toHaveBeenCalledWith("英単語");
  });

  test("デッキ名リネームが onRename で呼ばれる", () => {
    render(
      <DeckManager
        decks={decks}
        selectedDeck={selectedDeck}
        cards={cards}
        onSelect={mockOnSelect}
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onRename={mockOnRename}
      />
    );

    fireEvent.click(screen.getAllByText("リネーム")[0]);
    const input = screen.getByDisplayValue("英単語");
    fireEvent.change(input, { target: { value: "新しい英単語" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockOnRename).toHaveBeenCalledWith("英単語", "新しい英単語");
  });

  // -------------------------------
  // 追加のテスト
  // -------------------------------
  test("デッキが空の場合、select は空で新規作成ボタンのみ表示", () => {
    render(
      <DeckManager
        decks={[]}
        selectedDeck=""
        cards={[]}
        onSelect={mockOnSelect}
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onRename={mockOnRename}
      />
    );

    expect(screen.queryByRole("option")).not.toBeInTheDocument();
    expect(screen.getByText("＋新規デッキ")).toBeInTheDocument();
  });

  test("リネームキャンセルボタンを押すと編集モードが解除される", () => {
    const singleDeck = ["英単語"];
    render(
      <DeckManager
        decks={singleDeck}
        selectedDeck="英単語"
        cards={[]}
        onSelect={mockOnSelect}
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onRename={mockOnRename}
      />
    );

    fireEvent.click(screen.getByText("リネーム"));
    expect(screen.getByDisplayValue("英単語")).toBeInTheDocument();

    fireEvent.click(screen.getByText("キャンセル"));
    expect(screen.queryByDisplayValue("英単語")).not.toBeInTheDocument();
  });

  test("Escape キーでリネームキャンセルされる", () => {
    const singleDeck = ["英単語"];
    render(
      <DeckManager
        decks={singleDeck}
        selectedDeck="英単語"
        cards={[]}
        onSelect={mockOnSelect}
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onRename={mockOnRename}
      />
    );

    fireEvent.click(screen.getByText("リネーム"));
    const input = screen.getByDisplayValue("英単語");
    fireEvent.keyDown(input, { key: "Escape" });

    expect(screen.queryByDisplayValue("英単語")).not.toBeInTheDocument();
  });

  test("新規デッキ作成でキャンセルした場合は onAdd が呼ばれない", () => {
    window.prompt = jest.fn().mockReturnValue("");
    render(
      <DeckManager
        decks={[]}
        selectedDeck=""
        cards={[]}
        onSelect={mockOnSelect}
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onRename={mockOnRename}
      />
    );

    fireEvent.click(screen.getByText("＋新規デッキ"));
    expect(mockOnAdd).not.toHaveBeenCalled();
  });
});
