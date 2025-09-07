// src/test/DevPanel.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DevPanel from "./DevPanel";
import type { Flashcard } from "../components/types";

// モック関数を作成
const mockSetDecks = jest.fn();
const mockSetSelectedDeck = jest.fn();
const mockSetCards = jest.fn();
const mockSetView = jest.fn();
const mockSetMode = jest.fn();

describe("DevPanel Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("ボタンが正しく表示される", () => {
    render(
      <DevPanel
        setDecks={mockSetDecks}
        setSelectedDeck={mockSetSelectedDeck}
        setCards={mockSetCards}
        setView={mockSetView}
        setMode={mockSetMode}
      />
    );

    expect(screen.getByText("サンプル投入（複数デッキ）")).toBeInTheDocument();
    expect(screen.getByText("リセット")).toBeInTheDocument();
    expect(screen.getByText("カード画面へ")).toBeInTheDocument();
    expect(screen.getByText("単体モード")).toBeInTheDocument();
    expect(screen.getByText("リストモード")).toBeInTheDocument();
  });

  test("サンプル投入ボタンをクリックすると setDecks, setSelectedDeck, setCards が呼ばれる", () => {
    render(
      <DevPanel
        setDecks={mockSetDecks}
        setSelectedDeck={mockSetSelectedDeck}
        setCards={mockSetCards}
        setView={mockSetView}
        setMode={mockSetMode}
      />
    );

    const seedButton = screen.getByText("サンプル投入（複数デッキ）");
    fireEvent.click(seedButton);

    expect(mockSetDecks).toHaveBeenCalled();
    expect(mockSetSelectedDeck).toHaveBeenCalled();
    expect(mockSetCards).toHaveBeenCalled();
  });

  test("リセットボタンをクリックすると初期状態に戻る", () => {
    render(
      <DevPanel
        setDecks={mockSetDecks}
        setSelectedDeck={mockSetSelectedDeck}
        setCards={mockSetCards}
        setView={mockSetView}
        setMode={mockSetMode}
      />
    );

    const resetButton = screen.getByText("リセット");
    fireEvent.click(resetButton);

    expect(mockSetDecks).toHaveBeenCalledWith(["default"]);
    expect(mockSetSelectedDeck).toHaveBeenCalledWith("default");
    expect(mockSetCards).toHaveBeenCalledWith([
      {
        expression: "hello",
        meaning: "こんにちは",
        deckId: "default",
        part_of_speech: "",
        example: "",
        translation: "",
        category: "practical",
      },
    ]);
    expect(localStorage.getItem("selectedDeck")).toBe("default");
    expect(localStorage.getItem("decks")).toBe(JSON.stringify(["default"]));
  });

  test("モード切替・画面切替ボタンをクリックできる", () => {
    render(
      <DevPanel
        setDecks={mockSetDecks}
        setSelectedDeck={mockSetSelectedDeck}
        setCards={mockSetCards}
        setView={mockSetView}
        setMode={mockSetMode}
      />
    );

    fireEvent.click(screen.getByText("カード画面へ"));
    expect(mockSetView).toHaveBeenCalledWith("cards");

    fireEvent.click(screen.getByText("単体モード"));
    expect(mockSetMode).toHaveBeenCalledWith("single");

    fireEvent.click(screen.getByText("リストモード"));
    expect(mockSetMode).toHaveBeenCalledWith("list");
  });
});
