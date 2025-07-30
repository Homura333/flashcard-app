import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface TranslationNote {
  id: string;
  original: string;
  translation: string;
  annotations: {
    phrase: string;
    explanation: string;
  }[];
}

interface Props {
  notes: TranslationNote[];
  setNotes: React.Dispatch<React.SetStateAction<TranslationNote[]>>;
}

export default function TranslationNotesApp({ notes, setNotes }: Props) {
  const [selectedNote, setSelectedNote] = useState<TranslationNote | null>(null);
  const [addingNote, setAddingNote] = useState(false);
  const [newNote, setNewNote] = useState<TranslationNote>({
    id: '',
    original: '',
    translation: '',
    annotations: []
  });
  const [importJson, setImportJson] = useState('');
  const [showImportArea, setShowImportArea] = useState(false);
  const [viewMode, setViewMode] = useState<'menu' | 'list' | 'detail' | 'add'>('menu');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = { ...newNote, id: uuidv4() };
    setNotes([newEntry, ...notes]);
    setNewNote({ id: '', original: '', translation: '', annotations: [] });
    setAddingNote(false);
  };

  const addAnnotation = () => {
    setNewNote({
      ...newNote,
      annotations: [...newNote.annotations, { phrase: '', explanation: '' }]
    });
  };

  const updateAnnotation = (index: number, key: 'phrase' | 'explanation', value: string) => {
    const updated = [...newNote.annotations];
    updated[index][key] = value;
    setNewNote({ ...newNote, annotations: updated });
  };

  const handleDelete = (id: string) => {
    if (confirm('このノートを削除しますか？')) {
      setNotes(notes.filter((n) => n.id !== id));
      setSelectedNote(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">📚 対訳ノート</h1>

      {addingNote && (
        <form onSubmit={handleAddNote} className="space-y-2 bg-white p-4 border rounded shadow">
          <textarea
            placeholder="英文"
            value={newNote.original}
            onChange={(e) => setNewNote({ ...newNote, original: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <textarea
            placeholder="和訳"
            value={newNote.translation}
            onChange={(e) => setNewNote({ ...newNote, translation: e.target.value })}
            className="w-full border p-2 rounded"
          />
          {newNote.annotations.map((a, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                placeholder="語句"
                value={a.phrase}
                onChange={(e) => updateAnnotation(idx, 'phrase', e.target.value)}
                className="flex-1 border p-1 rounded"
              />
              <input
                placeholder="注釈"
                value={a.explanation}
                onChange={(e) => updateAnnotation(idx, 'explanation', e.target.value)}
                className="flex-2 border p-1 rounded"
              />
            </div>
          ))}
          <button type="button" onClick={addAnnotation} className="text-sm text-blue-600">＋ 注釈を追加</button>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">保存</button>
            <button type="button" onClick={() => setAddingNote(false)} className="bg-gray-400 text-white px-4 py-2 rounded">キャンセル</button>
          </div>
        </form>
      )}

      {viewMode === 'menu' && (
        <div className="flex gap-2">
          <button onClick={() => setViewMode('add')} className="bg-green-600 text-white px-4 py-2 rounded">＋ 新規作成</button>
          <button onClick={() => setShowImportArea(!showImportArea)} className="bg-blue-600 text-white px-4 py-2 rounded">📥 JSONインポート</button>
          <button onClick={() => setViewMode('list')} className="bg-purple-600 text-white px-4 py-2 rounded">📚 ノート一覧を見る</button>
        </div>
      )}

      {showImportArea && (
        <div className="mt-4 bg-white p-4 border rounded shadow space-y-2">
          <textarea
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            placeholder='JSON形式で貼り付け（配列形式）'
            className="w-full border p-2 rounded h-40 font-mono text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                try {
                  const parsed: TranslationNote[] = JSON.parse(importJson);
                  const withIds = parsed.map((note: any) => ({
                    id: note.id || uuidv4(),
                    original: note.original || '',
                    translation: note.translation || '',
                    annotations: note.annotations || note.notes?.map((n: any) => ({
                      phrase: n.term || '',
                      explanation: n.note || ''
                    })) || []
                  }));
                  setNotes(prevNotes => [...withIds, ...prevNotes]);
                  setImportJson('');
                  setShowImportArea(false);
                  alert('インポート成功！');
                  setViewMode('list');
                } catch (err) {
                  alert('JSONの形式が正しくありません');
                }
              }}
              className="bg-blue-700 text-white px-3 py-1 rounded"
            >
              読み込む
            </button>

            <button
              onClick={() => {
                setImportJson('');
                setShowImportArea(false);
              }}
              className="bg-gray-500 text-white px-3 py-1 rounded"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {viewMode === 'list' && (
        <ul className="space-y-2 mt-4">
          {notes.map(note => (
            <li
              key={note.id}
              onClick={() => {
                setSelectedNote(note);
                setViewMode('detail');
              }}
              className="p-3 border rounded bg-white shadow hover:bg-gray-100 cursor-pointer"
            >
              <p className="font-semibold text-blue-900 truncate">{note.original}</p>
              <p className="text-gray-700 text-sm truncate">{note.translation}</p>
            </li>
          ))}
          <button
            onClick={() => setViewMode('menu')}
            className="mt-4 bg-gray-500 text-white px-3 py-1 rounded"
          >
            メニューに戻る
          </button>
        </ul>
      )}

      {viewMode === 'detail' && selectedNote && (
        <div className="p-4 border rounded shadow bg-white space-y-3">
          <p className="text-blue-900 font-bold whitespace-pre-wrap">{selectedNote.original}</p>
          <p className="text-gray-800 whitespace-pre-wrap">{selectedNote.translation}</p>
          <div className="mt-2 space-y-1">
            {selectedNote.annotations.map((a, i) => (
              <p key={i} className="text-sm">📝 <strong>{a.phrase}</strong> — {a.explanation}</p>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => handleDelete(selectedNote.id)}
            >削除</button>

            <button
              className="bg-gray-400 text-white px-3 py-1 rounded"
              onClick={() => {
                setSelectedNote(null);
                setViewMode('list');
              }}
            >戻る</button>
          </div>
        </div>
      )}
    </div>
  );
}
