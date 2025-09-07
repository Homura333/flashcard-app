// src/test/cardUtils.test.ts
import { parseFlashcards, exportFlashcards } from "../utils/cardUtils";
import type { Flashcard } from "../components/types";

describe("cardUtils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("parseFlashcards", () => {
    beforeAll(() => {
      window.alert = jest.fn();
      console.error = jest.fn();
    });

    test("空文字の場合は空配列を返す", () => {
      const result = parseFlashcards("", "defaultDeck");
      expect(result).toEqual([]);
    });

    test("不正JSONの場合は空配列を返し alert が呼ばれる", () => {
      const result = parseFlashcards("invalid json", "defaultDeck");
      expect(result).toEqual([]);
      expect(window.alert).toHaveBeenCalledWith("JSONが不正です");
    });

    test("正しいJSONを変換できる", () => {
      const json = JSON.stringify([
        { expression: "apple", meaning: "りんご" },
        { expression: "banana", meaning: "バナナ", deckId: "fruits", category: "literary" }
      ]);

      const result = parseFlashcards(json, "defaultDeck");
      expect(result).toEqual([
        {
          expression: "apple",
          meaning: "りんご",
          deckId: "defaultDeck",
          part_of_speech: "",
          example: "",
          translation: "",
          category: "practical",
        },
        {
          expression: "banana",
          meaning: "バナナ",
          deckId: "fruits",
          part_of_speech: "",
          example: "",
          translation: "",
          category: "literary",
        },
      ]);
    });

    test("重複カードがある場合は alert が呼ばれる", () => {
      const json = JSON.stringify([
        { expression: "apple", meaning: "りんご" },
        { expression: "apple", meaning: "リンゴ" }
      ]);

      parseFlashcards(json, "defaultDeck");
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining("同じデッキ内で重複するカードがあります")
      );
    });
  });

  describe("exportFlashcards", () => {
    let createObjectURLMock: jest.Mock;
    let revokeObjectURLMock: jest.Mock;

    beforeAll(() => {
      window.alert = jest.fn();

      // Jest 環境で URL.createObjectURL / revokeObjectURL がない場合はモックする
      if (!("createObjectURL" in URL)) {
        // @ts-ignore
        URL.createObjectURL = jest.fn();
      }
      if (!("revokeObjectURL" in URL)) {
        // @ts-ignore
        URL.revokeObjectURL = jest.fn();
      }

      createObjectURLMock = URL.createObjectURL as jest.Mock;
      revokeObjectURLMock = URL.revokeObjectURL as jest.Mock;
    });

    test("空配列なら alert が呼ばれる", () => {
      exportFlashcards([]);
      expect(window.alert).toHaveBeenCalledWith("カードがありません");
    });

    test("カードがある場合は createObjectURL と click が呼ばれる", () => {
      const cards: Flashcard[] = [
        { expression: "apple", meaning: "りんご", deckId: "default", part_of_speech: "", example: "", translation: "", category: "practical" }
      ];

      const clickMock = jest.fn();
      // document.createElement をモックして aタグの click を確認
      document.createElement = jest.fn().mockReturnValue({
        href: "",
        download: "",
        click: clickMock,
      } as any);

      exportFlashcards(cards, "deck1");

      expect(createObjectURLMock).toHaveBeenCalled();
      expect(clickMock).toHaveBeenCalled();
      expect(revokeObjectURLMock).toHaveBeenCalled();
    });
  });
});
