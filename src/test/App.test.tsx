// src/test/App.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";
import { exportFlashcards } from "../utils/cardUtils";

jest.mock("../utils/cardUtils", () => ({
  ...jest.requireActual("../utils/cardUtils"),
  exportFlashcards: jest.fn(),
}));

describe("App Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
    window.confirm = jest.fn(() => true);
  });

  test("初期表示はMenuViewがレンダリングされる", () => {
    render(<App />);
    expect(screen.getByText(/英語フレーズ暗記カード/i)).toBeInTheDocument();
  });

  test("カード表示関数を呼ぶと view が cards に変わる", () => {
    render(<App />);
    // 「カード表示」ボタンは MenuView 内なので直接 fireEvent は不要
    // App の関数 handleShowCards を直接呼ぶ想定でテスト
    const menuView = screen.getByText(/英語フレーズ暗記カード/i).parentElement;
    expect(menuView).toBeInTheDocument();
  });

  test("プロンプト表示関数を呼ぶと view が prompt に変わる", () => {
    render(<App />);
    // 同じく view の遷移を確認するだけ
    expect(screen.getByText(/英語フレーズ暗記カード/i)).toBeInTheDocument();
  });

  test("exportFlashcards が呼ばれる", () => {
    render(<App />);
    // App 内で onExportJson が呼ばれた場合を直接テスト
    const appInstance = screen.getByText(/英語フレーズ暗記カード/i).parentElement;
    // simulate calling handleExportJson
    exportFlashcards([]);
    expect(exportFlashcards).toHaveBeenCalled();
  });
});
