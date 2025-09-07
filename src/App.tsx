// src/App.tsx
import { useReducer, useEffect, useState } from "react";
import MenuView from "./components/MenuView";
import CardsView from "./components/CardsView";
import PromptView from "./components/PromptView";
import type { Flashcard } from "./components/types";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { cardReducer, initialCardState } from "./reducers/cardReducer";
import { parseFlashcards, exportFlashcards } from "./utils/cardUtils";

function App() {
  const [view, setView] = useLocalStorage<"menu" | "cards" | "prompt">("view", "menu");
  const [decks, setDecks] = useLocalStorage<string[]>("decks", ["default"]);
  const [selectedDeck, setSelectedDeck] = useLocalStorage<string>("selectedDeck", "default");
  const [cards, setCards] = useLocalStorage<Flashcard[]>("cards", [
    { expression: "hello", meaning: "こんにちは", deckId: "default", part_of_speech: "", example: "", translation: "", category: "practical" },
  ]);
  const [jsonInput, setJsonInput] = useLocalStorage<string>("jsonInput", "");
  const [mode, setMode] = useLocalStorage<"single" | "list">("cardMode", "single");

  const [cardState, dispatch] = useReducer(cardReducer, initialCardState(cards.length));
  const visibleCards = cards.filter(c => c.deckId === selectedDeck);

  // --- デバッグパネル表示制御 ---
  const [showDev, setShowDev] = useState(false);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        setShowDev(prev => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    dispatch({ type: "resetFlippedStates", length: cards.length });
  }, [cards.length]);

  const handleShowCards = () => {
    if (!visibleCards.length) return alert("このデッキにカードがありません");
    setView("cards");
  };

  const handleExportJson = () => {
    exportFlashcards(cards); // 全カードをエクスポート
  };

  const handlePasteJson = () => {
    const parsed = parseFlashcards(jsonInput, selectedDeck);
    if (!parsed.length) return;
    setCards(parsed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-6">
        {view === "menu" && (
          <MenuView
            decks={decks}
            selectedDeck={selectedDeck}
            cards={cards}
            onSelectDeck={setSelectedDeck}
            onAddDeck={name => setDecks(prev => [...prev, name])}
            onDeleteDeck={deck => {
              if (!confirm(`「${deck}」を削除しますか？（このデッキのカードも削除されます）`)) return;
              setDecks(prev => prev.filter(d => d !== deck));
              setCards(prev => prev.filter(c => c.deckId !== deck));
              setSelectedDeck(prev => (prev === deck ? decks.filter(d => d !== deck)[0] ?? "" : prev));
            }}
            onRenameDeck={(oldName, newName) =>
              setDecks(prev => prev.map(d => (d === oldName ? newName : d)))
            }
            jsonInput={jsonInput}
            setJsonInput={setJsonInput}
            onPasteJson={handlePasteJson}
            onExportJson={handleExportJson}
            onShowCards={handleShowCards}
            onShowPrompt={() => setView("prompt")}
          />
        )}

        {view === "cards" && (
          <CardsView
            visibleCards={visibleCards}
            cardState={cardState}
            dispatch={dispatch}
            mode={mode}
            setMode={setMode}
            onBack={() => setView("menu")}
            setCards={setCards}
          />
        )}

        {view === "prompt" && <PromptView setView={setView} />}
      </div>

      {showDev && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white rounded-xl shadow-lg p-4 space-x-2">
          <p className="text-xs mb-2 opacity-80">DevPanel</p>
          <button
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-sm"
            onClick={() => setCards([])}
          >
            全カード削除
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-lg text-sm"
            onClick={() =>
              setCards(prev => [
                ...prev,
                { expression: "test", meaning: "テスト", deckId: selectedDeck, part_of_speech: "", example: "", translation: "", category: "practical" },
              ])
            }
          >
            テストカード追加
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
