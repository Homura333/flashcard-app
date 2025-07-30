// App.tsx
import { useState, useEffect } from 'react';
import type { Flashcard, QuizQuestion, PhraseEntry, TranslationNote } from './types'; 
import TranslationNotesApp from './TranslationNotes';

const STORAGE_KEY = 'flashcards';

export default function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [flippedStates, setFlippedStates] = useState<boolean[]>([]);
  const [mode, setMode] = useState<'single' | 'list' | 'quiz' | 'phrases' | 'translationNotes'>('single');
  const [view, setView] = useState<'menu' | 'cards' | 'translationNotes'>('menu');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedCard, setEditedCard] = useState<Flashcard | null>(null);
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);
  const [phraseData, setPhraseData] = useState<PhraseEntry[]>([]);
  const [translationNotes, setTranslationNotes] = useState<TranslationNote[]>([]);

    // ✅ 初期化：localStorage から読み込む
  useEffect(() => {
    const stored = localStorage.getItem('translationNotes');
    if (stored) {
      try {
        setTranslationNotes(JSON.parse(stored));
      } catch (e) {
        console.error('対訳ノートの読み込み失敗', e);
      }
    }
  }, []);

  // ✅ 保存：translationNotes が更新されたとき保存
  useEffect(() => {
    localStorage.setItem('translationNotes', JSON.stringify(translationNotes));
  }, [translationNotes]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: Flashcard[] = JSON.parse(saved);
        setCards(parsed);
        setFlippedStates(new Array(parsed.length).fill(false));
      } catch (e) {
        console.error('保存されたカードの読み込みに失敗しました', e);
      }
    }
  }, []);

  const saveToLocalStorage = (data: Flashcard[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const handlePasteJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);

      let newCards: Flashcard[] = [...cards];
      let newQuiz: QuizQuestion[] = [...quizData];
      let newPhrases: PhraseEntry[] = [...phraseData];

      if (Array.isArray(parsed)) {
        newCards = [...cards, ...parsed];
      }
      if (parsed.cards && Array.isArray(parsed.cards)) {
        newCards = [...cards, ...parsed.cards];
      }
      if (parsed.quiz && Array.isArray(parsed.quiz)) {
        newQuiz = [...quizData, ...parsed.quiz];
      }
      if (parsed.phrases && Array.isArray(parsed.phrases)) {
        newPhrases = [...phraseData, ...parsed.phrases];
      }

      setCards(newCards);
      setQuizData(newQuiz);
      setPhraseData(newPhrases);
      setCurrentIndex(0);
      setFlipped(false);
      setFlippedStates(new Array(newCards.length).fill(false));
      saveToLocalStorage(newCards);
      setJsonInput('');
      setView('cards');
      alert('データを読み込んで保存しました ✅');
    } catch (err) {
      console.error(err);
      alert('JSONの読み込みに失敗しました');
    }
  };

  const toggleFlip = () => setFlipped(!flipped);
  const toggleCardInList = (index: number) => {
    const newStates = [...flippedStates];
    newStates[index] = !newStates[index];
    setFlippedStates(newStates);
  };

  const handleFieldChange = (field: keyof Flashcard, value: string) => {
    if (editedCard) {
      setEditedCard({ ...editedCard, [field]: value });
    }
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex justify-center">
      <div className="w-full max-w-2xl flex flex-col items-center">
        {view === 'menu' && (
          <>
            <h1 className="text-2xl font-bold mb-4">英語フレーズ暗記カード</h1>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="ここにJSONを貼り付けてください"
              className="w-full max-w-3xl h-[300px] p-4 border border-gray-300 rounded mb-4 resize"
            />
            <div className="flex gap-2 mb-4">
              <button onClick={handlePasteJson} className="bg-blue-600 text-white px-4 py-2 rounded">生成</button>
              <button
                onClick={() => cards.length > 0 ? setView('cards') : alert('保存されたカードがありません')}
                className="bg-purple-600 text-white px-4 py-2 rounded"
              >カードを見る</button>
              <button
                onClick={() => setView('translationNotes')}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                📚 対訳ノート
              </button>           
            </div>
          </>
        )}

        {view === 'cards' && (
          <>
            <div className="flex justify-between w-full mb-4">
              <button onClick={() => setView('menu')} className="bg-gray-600 text-white px-4 py-2 rounded">メニュー</button>
              <button onClick={() => setMode(mode === 'list' ? 'single' : 'list')} className="bg-gray-700 text-white px-4 py-2 rounded">
                モード切替: {mode === 'single' ? '一覧' : '1枚'}
              </button>
              {/* ✅ 一括削除ボタン */}
              <button
                onClick={() => {
                  if (confirm('すべてのカードを削除しますか？')) {
                    setCards([]);
                    setFlippedStates([]);
                    saveToLocalStorage([]);
                    setCurrentIndex(0);
                    setFlipped(false);
                    alert('すべてのカードを削除しました');
                  }
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                🔥 全削除
              </button>             
            </div>          

            {mode === 'single' && currentCard && (
              <>
                <div
                  onClick={toggleFlip}
                  className="cursor-pointer w-full max-w-md p-6 border rounded-2xl shadow-md bg-white text-center mb-4"
                >
                  {!flipped ? (
                    <p className="text-2xl font-bold text-blue-700">{currentCard.expression}</p>
                  ) : (
                    <div className="text-sm text-gray-800 space-y-1">
                      <p><strong>意味:</strong> {currentCard.meaning}</p>
                      <p><strong>品詞:</strong> {currentCard.part_of_speech}</p>
                      <p><strong>例文:</strong> <em>{currentCard.example}</em></p>
                      <p><strong>和訳:</strong> {currentCard.translation}</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (currentIndex < cards.length - 1) {
                      setCurrentIndex(currentIndex + 1);
                      setFlipped(false);
                    } else {
                      alert('最後のカードです');
                    }
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >次へ ▶</button>
              </>
            )}

            {mode === 'list' && (
              <div className="w-full space-y-4">
                {cards.map((card, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg shadow bg-white"
                    onClick={() => toggleCardInList(index)}
                  >
                    <p className="text-xl font-semibold text-blue-700">{card.expression}</p>

                    {flippedStates[index] && (
                      <>
                        {editingIndex === index && editedCard ? (
                          <div
                            className="space-y-2 mt-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {(['expression', 'meaning', 'part_of_speech', 'example', 'translation'] as (keyof Flashcard)[]).map((field) => (
                              <input
                                key={field}
                                type="text"
                                value={editedCard?.[field] ?? ''}
                                onChange={(e) => handleFieldChange(field, e.target.value)}
                                placeholder={field}
                                className="w-full p-1 border rounded"
                              />
                            ))}
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!editedCard) return;
                                  const updated = [...cards];
                                  updated[index] = editedCard;
                                  setCards(updated);
                                  saveToLocalStorage(updated);
                                  setEditingIndex(null);
                                  setEditedCard(null);
                                }}
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                              >
                                保存
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingIndex(null);
                                  setEditedCard(null);
                                }}
                                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                              >
                                キャンセル
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-800 space-y-1 mt-2">
                            <p><strong>意味:</strong> {card.meaning}</p>
                            <p><strong>品詞:</strong> {card.part_of_speech}</p>
                            <p><strong>例文:</strong> <em>{card.example}</em></p>
                            <p><strong>和訳:</strong> {card.translation}</p>
                            <div className="mt-2 flex gap-2">
                              <button
                                className="text-sm bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingIndex(index);
                                  setEditedCard({ ...card });
                                }}
                              >
                                編集
                              </button>
                              <button
                                className="text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm('このカードを削除しますか？')) {
                                    const updated = [...cards];
                                    updated.splice(index, 1);
                                    setCards(updated);
                                    setFlippedStates(new Array(updated.length).fill(false));
                                    saveToLocalStorage(updated);
                                  }
                                }}
                              >
                                削除
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {mode === 'quiz' && (
              <div className="w-full space-y-4">
                {quizData.map((q, i) => (
                  <div key={i} className="p-4 border rounded shadow bg-white">
                    <p className="font-bold mb-2">{q.question}</p>
                    {q.options.map((opt, j) => (
                      <button
                        key={j}
                        className="block w-full text-left px-3 py-2 mb-1 bg-blue-100 hover:bg-blue-200 rounded"
                        onClick={() => alert(j === q.answerIndex ? '正解！' : '不正解')}
                      >{opt}</button>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {mode === 'phrases' && (
              <div className="w-full space-y-4">
                {phraseData.map((p, i) => (
                  <div key={i} className="p-4 border rounded shadow bg-white">
                    <p className="font-bold text-blue-800">{p.phrase}</p>
                    <p>意味: {p.meaning}</p>
                    <p>例文: <em>{p.example}</em></p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {view === 'translationNotes' && (
          <>
            <div className="mb-4">
              <button
                onClick={() => setView('menu')}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                メニューに戻る
              </button>
            </div>

            <TranslationNotesApp
              notes={translationNotes}
              setNotes={setTranslationNotes}
            />

          </>
        )}        
      </div>
    </div>
  );
}
