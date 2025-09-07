// src/test/MenuView.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import MenuView from "../components/MenuView";

// ダミーデータとモック関数を準備
const decks = ["英語", "数学"];
const selectedDeck = "英語";
const cards = [{ front: "hello", back: "こんにちは" }];
const mockSelectDeck = jest.fn();
const mockAddDeck = jest.fn();
const mockDeleteDeck = jest.fn();
const mockRenameDeck = jest.fn();
const mockSetJsonInput = jest.fn();
const mockPasteJson = jest.fn();
const mockExportJson = jest.fn();
const mockShowCards = jest.fn();
const mockShowPrompt = jest.fn();

describe("MenuView Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("タイトル・テキストエリア・ボタンが表示される", () => {
    render(
      <MenuView
        decks={decks}
        selectedDeck={selectedDeck}
        cards={cards}
        onSelectDeck={mockSelectDeck}
        onAddDeck={mockAddDeck}
        onDeleteDeck={mockDeleteDeck}
        onRenameDeck={mockRenameDeck}
        jsonInput=""
        setJsonInput={mockSetJsonInput}
        onPasteJson={mockPasteJson}
        onExportJson={mockExportJson}
        onShowCards={mockShowCards}
        onShowPrompt={mockShowPrompt}
      />
    );

    // タイトル
    expect(screen.getByText("英語フレーズ暗記カード")).toBeInTheDocument();

    // JSONテキストエリア
    expect(screen.getByPlaceholderText("ここにJSONを貼り付けてください")).toBeInTheDocument();

    // 各ボタン
    expect(screen.getByText("JSON読み込み")).toBeInTheDocument();
    expect(screen.getByText("JSON書き出し")).toBeInTheDocument();
    expect(screen.getByText("カード表示")).toBeInTheDocument();
    expect(screen.getByText("プロンプト")).toBeInTheDocument();
  });

  test("ボタンクリックでコールバックが呼ばれる", () => {
    render(
      <MenuView
        decks={decks}
        selectedDeck={selectedDeck}
        cards={cards}
        onSelectDeck={mockSelectDeck}
        onAddDeck={mockAddDeck}
        onDeleteDeck={mockDeleteDeck}
        onRenameDeck={mockRenameDeck}
        jsonInput=""
        setJsonInput={mockSetJsonInput}
        onPasteJson={mockPasteJson}
        onExportJson={mockExportJson}
        onShowCards={mockShowCards}
        onShowPrompt={mockShowPrompt}
      />
    );

    fireEvent.click(screen.getByText("JSON読み込み"));
    expect(mockPasteJson).toHaveBeenCalled();

    fireEvent.click(screen.getByText("JSON書き出し"));
    expect(mockExportJson).toHaveBeenCalled();

    fireEvent.click(screen.getByText("カード表示"));
    expect(mockShowCards).toHaveBeenCalled();

    fireEvent.click(screen.getByText("プロンプト"));
    expect(mockShowPrompt).toHaveBeenCalled();
  });

  test("テキストエリアに入力すると setJsonInput が呼ばれる", () => {
    render(
      <MenuView
        decks={decks}
        selectedDeck={selectedDeck}
        cards={cards}
        onSelectDeck={mockSelectDeck}
        onAddDeck={mockAddDeck}
        onDeleteDeck={mockDeleteDeck}
        onRenameDeck={mockRenameDeck}
        jsonInput=""
        setJsonInput={mockSetJsonInput}
        onPasteJson={mockPasteJson}
        onExportJson={mockExportJson}
        onShowCards={mockShowCards}
        onShowPrompt={mockShowPrompt}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("ここにJSONを貼り付けてください"), {
      target: { value: '{"test":123}' },
    });

    expect(mockSetJsonInput).toHaveBeenCalledWith('{"test":123}');
  });
});
