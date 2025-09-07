// src/test/CardSingle.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CardSingle from "../components/CardSingle";
import type { Flashcard } from "../components/types";

describe("CardSingle Component", () => {
  const mockCard: Flashcard = {
    expression: "Hello",
    meaning: "こんにちは",
    deckId: "default",
    part_of_speech: "interjection",
    example: "Hello, how are you?",
    translation: "こんにちは、元気ですか？",
    category: "practical",
  };

  const mockOnFlip = jest.fn();
  const mockOnNext = jest.fn();
  const mockOnPrev = jest.fn();

  const defaultProps = {
    card: mockCard,
    flipped: false,
    onFlip: mockOnFlip,
    onNext: mockOnNext,
    onPrev: mockOnPrev,
    hasNext: true,
    hasPrev: false,
  };

  it("カードの表面を正しく表示する", () => {
    render(<CardSingle {...defaultProps} />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.queryByText(/意味:/)).toBeNull();
  });

  it("カードの裏面を正しく表示する", () => {
    render(<CardSingle {...defaultProps} flipped={true} />);
    expect(screen.getByText(/意味:/)).toBeInTheDocument();
    expect(screen.getByText("こんにちは")).toBeInTheDocument();
    expect(screen.getByText("interjection")).toBeInTheDocument();
    expect(screen.getByText("practical")).toBeInTheDocument();
    expect(screen.getByText(/Hello, how are you\?/)).toBeInTheDocument();
    expect(screen.getByText(/こんにちは、元気ですか？/)).toBeInTheDocument();
  });

  it("前へ・次へボタンの有効/無効状態を反映する", () => {
    render(<CardSingle {...defaultProps} />);
    const prevButton = screen.getByText("◀ 前へ");
    const nextButton = screen.getByText("次へ ▶");

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeEnabled();
  });

  it("ボタン押下でコールバックが呼ばれる", () => {
    render(<CardSingle {...defaultProps} />);
    const cardDiv = screen.getByText("Hello").parentElement!;
    fireEvent.click(cardDiv);
    expect(mockOnFlip).toHaveBeenCalledTimes(1);

    const nextButton = screen.getByText("次へ ▶");
    fireEvent.click(nextButton);
    expect(mockOnNext).toHaveBeenCalledTimes(1);

    const prevButton = screen.getByText("◀ 前へ");
    fireEvent.click(prevButton);
    expect(mockOnPrev).toHaveBeenCalledTimes(0); // disabledなので呼ばれない
  });
});
