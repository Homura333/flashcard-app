import type { Flashcard } from "../components/types";

export type CardState = {
  currentIndex: number;
  flippedStates: boolean[];
  editingIndex: number | null;
  editedCard: Flashcard | null;
};

export type CardAction =
  | { type: "setIndex"; index: number; resetFlip?: boolean }
  | { type: "toggleFlip"; index: number }
  | { type: "editStart"; index: number; card: Flashcard }
  | { type: "editCancel" }
  | { type: "editFieldChange"; field: keyof Flashcard; value: string }
  | { type: "editSave" }
  | { type: "resetFlippedStates"; length: number };

export const initialCardState = (length: number): CardState => ({
  currentIndex: 0,
  flippedStates: Array(length).fill(false),
  editingIndex: null,
  editedCard: null,
});

export function cardReducer(state: CardState, action: CardAction): CardState {
  switch (action.type) {
    case "setIndex":
      return {
        ...state,
        currentIndex: action.index,
        flippedStates: action.resetFlip
          ? state.flippedStates.map((f, i) => (i === action.index ? false : f))
          : state.flippedStates,
      };

    case "toggleFlip":
      return {
        ...state,
        flippedStates: state.flippedStates.map((f, i) =>
          i === action.index ? !f : f
        ),
      };

    case "editStart":
      return {
        ...state,
        editingIndex: action.index,
        editedCard: { ...action.card },
      };

    case "editCancel":
      return {
        ...state,
        editingIndex: null,
        editedCard: null,
      };

    case "editFieldChange":
      if (!state.editedCard) return state;
      return {
        ...state,
        editedCard: { ...state.editedCard, [action.field]: action.value },
      };

    case "editSave":
      return {
        ...state,
        editingIndex: null,
        editedCard: null,
      };

    case "resetFlippedStates":
      return {
        ...state,
        flippedStates: Array(action.length).fill(false),
      };

    default:
      return state;
  }
}
