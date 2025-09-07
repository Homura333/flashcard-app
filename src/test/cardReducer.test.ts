// src/test/cardReducer.test.ts
import { cardReducer, initialCardState, type CardState } from "../reducers/cardReducer";
import type { Flashcard } from "../components/types";

describe("cardReducer", () => {
  const sampleCard: Flashcard = {
    deckId: "英単語",
    expression: "apple",
    meaning: "りんご",
    part_of_speech: "名詞",
    example: "I eat an apple.",
    translation: "私はりんごを食べます。",
  };

  let state: CardState;

  beforeEach(() => {
    state = initialCardState(3); // 3枚のカードとして初期化
  });

  test("初期状態が正しい", () => {
    expect(state.currentIndex).toBe(0);
    expect(state.flippedStates).toEqual([false, false, false]);
    expect(state.editingIndex).toBeNull();
    expect(state.editedCard).toBeNull();
  });

  test("setIndex が currentIndex を更新する", () => {
    const newState = cardReducer(state, { type: "setIndex", index: 2 });
    expect(newState.currentIndex).toBe(2);
  });

  test("setIndex で resetFlip が true の場合、該当カードのみ flip を false にする", () => {
    state.flippedStates = [true, true, true];
    const newState = cardReducer(state, { type: "setIndex", index: 1, resetFlip: true });
    expect(newState.flippedStates).toEqual([true, false, true]);
  });

  test("toggleFlip が指定インデックスを反転させる", () => {
    const newState = cardReducer(state, { type: "toggleFlip", index: 0 });
    expect(newState.flippedStates[0]).toBe(true);
  });

  test("editStart が editingIndex と editedCard を設定する", () => {
    const newState = cardReducer(state, { type: "editStart", index: 1, card: sampleCard });
    expect(newState.editingIndex).toBe(1);
    expect(newState.editedCard).toEqual(sampleCard);
  });

  test("editCancel が編集状態をリセットする", () => {
    state = cardReducer(state, { type: "editStart", index: 0, card: sampleCard });
    const newState = cardReducer(state, { type: "editCancel" });
    expect(newState.editingIndex).toBeNull();
    expect(newState.editedCard).toBeNull();
  });

  test("editFieldChange が編集中カードのフィールドを更新する", () => {
    state = cardReducer(state, { type: "editStart", index: 0, card: sampleCard });
    const newState = cardReducer(state, { type: "editFieldChange", field: "meaning", value: "アップル" });
    expect(newState.editedCard?.meaning).toBe("アップル");
  });

  test("editSave が編集状態をリセットする", () => {
    state = cardReducer(state, { type: "editStart", index: 0, card: sampleCard });
    const newState = cardReducer(state, { type: "editSave" });
    expect(newState.editingIndex).toBeNull();
    expect(newState.editedCard).toBeNull();
  });

  test("resetFlippedStates が全て false にリセットする", () => {
    state.flippedStates = [true, true, false];
    const newState = cardReducer(state, { type: "resetFlippedStates", length: 3 });
    expect(newState.flippedStates).toEqual([false, false, false]);
  });

  test("未知の action タイプは state を変更しない", () => {
    // @ts-expect-error: 意図的に未知の action を渡す
    const newState = cardReducer(state, { type: "unknown" });
    expect(newState).toEqual(state);
  });
});
