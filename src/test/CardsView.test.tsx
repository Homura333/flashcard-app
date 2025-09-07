// src/test/CardsView.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import CardsView from "../components/CardsView";
import type { Flashcard } from "../components/types";

describe("CardsView Component", () => {
  const sampleCards: Flashcard[] = [
    {
      expression: "Hello",
      meaning: "こんにちは",
      deckId: "default",
      part_of_speech: "",
      example: "",
      translation: "",
      category: "practical",
    },
    {
      expression: "Goodbye",
      meaning: "さようなら",
      deckId: "default",
      part_of_speech: "",
      example: "",
      translation: "",
      category: "practical",
    },
  ];

  const mockDispatch = jest.fn();
  const mockSetCards = jest.fn();
  const mockOnBack = jest.fn();
  let cardState = {
    currentIndex: 0,
    flippedStates: [false, false],
    editingIndex: null,
    editedCard: null,
  };
  let mode: "single" | "list" = "single";
  const setMode = jest.fn((m: "single" | "list") => (mode = m));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("単体表示モードでカードと進捗が表示される", () => {
    render(
      <CardsView
        visibleCards={sampleCards}
        cardState={cardState}
        dispatch={mockDispatch}
        mode={mode}
        setMode={setMode}
        onBack={mockOnBack}
        setCards={mockSetCards}
      />
    );

    // カード前面テキストが表示される
    expect(screen.getByText(/hello/i)).toBeInTheDocument();

    // 進捗表示
    expect(screen.getByText("1 / 2")).toBeInTheDocument();

    // メニューボタン
    expect(screen.getByText("← メニューに戻る")).toBeInTheDocument();
  });

  test("モード切替 select で list に変更できる", () => {
    render(
      <CardsView
        visibleCards={sampleCards}
        cardState={cardState}
        dispatch={mockDispatch}
        mode={mode}
        setMode={setMode}
        onBack={mockOnBack}
        setCards={mockSetCards}
      />
    );

    const select = screen.getByDisplayValue("単体表示") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "list" } });

    expect(setMode).toHaveBeenCalledWith("list");
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "resetFlippedStates",
      length: sampleCards.length,
    });
  });

  test("onBack が呼ばれる", () => {
    render(
      <CardsView
        visibleCards={sampleCards}
        cardState={cardState}
        dispatch={mockDispatch}
        mode={mode}
        setMode={setMode}
        onBack={mockOnBack}
        setCards={mockSetCards}
      />
    );

    fireEvent.click(screen.getByText("← メニューに戻る"));
    expect(mockOnBack).toHaveBeenCalled();
  });

  test("カードが空の場合に onBack が呼ばれる", () => {
    render(
      <CardsView
        visibleCards={[]}
        cardState={cardState}
        dispatch={mockDispatch}
        mode={mode}
        setMode={setMode}
        onBack={mockOnBack}
        setCards={mockSetCards}
      />
    );

    expect(mockOnBack).toHaveBeenCalled();
  });
});
