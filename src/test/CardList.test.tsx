// src/test/CardList.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import CardList from "../components/CardList";
import type { Flashcard } from "../types";

describe("CardList Component", () => {
  const sampleCards: Flashcard[] = [
    {
      expression: "apple",
      meaning: "りんご",
      part_of_speech: "noun",
      example: "I ate an apple.",
      translation: "私はりんごを食べた",
      category: "fruit",
    },
    {
      expression: "run",
      meaning: "走る",
      part_of_speech: "verb",
      example: "I run every morning.",
      translation: "私は毎朝走る",
      category: "action",
    },
  ];

  const defaultProps = {
    cards: sampleCards,
    flippedStates: [false, false],
    editingIndex: null,
    editedCard: null,
    onToggle: jest.fn(),
    onEditStart: jest.fn(),
    onEditCancel: jest.fn(),
    onEditSave: jest.fn(),
    onDelete: jest.fn(),
    onFieldChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("カードの表面が正しく表示される", () => {
    render(<CardList {...defaultProps} />);
    expect(screen.getByText("apple")).toBeInTheDocument();
    expect(screen.getByText("run")).toBeInTheDocument();
  });

  test("カードをクリックすると onToggle が呼ばれる", () => {
    render(<CardList {...defaultProps} />);
    fireEvent.click(screen.getByText("apple"));
    expect(defaultProps.onToggle).toHaveBeenCalledWith(0);
  });

  test("編集ボタンをクリックすると onEditStart が呼ばれる", () => {
    render(<CardList {...defaultProps} flippedStates={[true, false]} />);
    fireEvent.click(screen.getAllByText("編集")[0]);
    expect(defaultProps.onEditStart).toHaveBeenCalledWith(0, sampleCards[0]);
  });

  test("削除ボタンをクリックすると onDelete が呼ばれる", () => {
    render(<CardList {...defaultProps} flippedStates={[true, false]} />);
    fireEvent.click(screen.getAllByText("削除")[0]);
    expect(defaultProps.onDelete).toHaveBeenCalledWith(0);
  });

  test("編集モード時に入力を変更すると onFieldChange が呼ばれる", () => {
    const editedCard = { ...sampleCards[0] };
    render(
      <CardList
        {...defaultProps}
        flippedStates={[true, false]}
        editingIndex={0}
        editedCard={editedCard}
      />
    );

    const input = screen.getByPlaceholderText("meaning") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "リンゴ" } });
    expect(defaultProps.onFieldChange).toHaveBeenCalledWith("meaning", "リンゴ");
  });

  test("保存ボタンをクリックすると onEditSave が呼ばれる", () => {
    const editedCard = { ...sampleCards[0] };
    render(
      <CardList
        {...defaultProps}
        flippedStates={[true, false]}
        editingIndex={0}
        editedCard={editedCard}
      />
    );

    fireEvent.click(screen.getByText("保存"));
    expect(defaultProps.onEditSave).toHaveBeenCalledWith(0, editedCard);
  });

  test("キャンセルボタンをクリックすると onEditCancel が呼ばれる", () => {
    const editedCard = { ...sampleCards[0] };
    render(
      <CardList
        {...defaultProps}
        flippedStates={[true, false]}
        editingIndex={0}
        editedCard={editedCard}
      />
    );

    fireEvent.click(screen.getByText("キャンセル"));
    expect(defaultProps.onEditCancel).toHaveBeenCalled();
  });
});
