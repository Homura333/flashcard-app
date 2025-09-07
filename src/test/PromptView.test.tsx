// src/test/PromptView.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import PromptView from '../components/PromptView';
import * as saveModule from '../components/savePrompts';

describe('PromptView Component', () => {
  const setViewMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('テキスト入力と自動分割ボタンの動作', () => {
    render(<PromptView setView={setViewMock} />);

    const textarea = screen.getByPlaceholderText('ここに文章を入力...');
    fireEvent.change(textarea, { target: { value: 'Hello world. This is a test sentence.' } });
    expect(textarea).toHaveValue('Hello world. This is a test sentence.');

    const splitButton = screen.getByText('自動分割');
    fireEvent.click(splitButton);

    const markers = screen.getAllByText(/BLOCK/);
    expect(markers.length).toBeGreaterThan(0);
  });

  test('プロンプト保存ボタンで savePromptsToFile が呼ばれる', () => {
    const saveSpy = jest.spyOn(saveModule, 'savePromptsToFile').mockImplementation(jest.fn());

    render(<PromptView setView={setViewMock} />);

    const textarea = screen.getByPlaceholderText('ここに文章を入力...');
    fireEvent.change(textarea, { target: { value: 'Sample text for prompt.' } });

    const saveButton = screen.getByText('💾 プロンプトを保存');
    fireEvent.click(saveButton);

    expect(saveSpy).toHaveBeenCalled();
    const args = saveSpy.mock.calls[0][0];
    expect(Array.isArray(args)).toBe(true);
    expect(args[0]).toContain('Sample text for prompt.');
  });

  test('メニューに戻るボタンで setView が呼ばれる', () => {
    render(<PromptView setView={setViewMock} />);

    const menuButton = screen.getByText('メニューに戻る');
    fireEvent.click(menuButton);

    expect(setViewMock).toHaveBeenCalledWith('menu');
  });

  test('空テキストの場合、生成プロンプトは存在しない', () => {
    render(<PromptView setView={setViewMock} />);
    expect(screen.queryByText(/🧠 抽出プロンプト/)).not.toBeInTheDocument();
  });

  test('テキストが空白のみの場合、生成プロンプトは disabled', () => {
    render(<PromptView setView={setViewMock} />);

    const textarea = screen.getByPlaceholderText('ここに文章を入力...');
    fireEvent.change(textarea, { target: { value: '   ' } });

    const splitButton = screen.getByText('自動分割');
    fireEvent.click(splitButton);

    expect(screen.queryByText(/🧠 抽出プロンプト/)).not.toBeInTheDocument();
  });

  test('ドラッグ&ドロップイベントで markers が更新される', () => {
    render(<PromptView setView={setViewMock} />);

    const textarea = screen.getByPlaceholderText('ここに文章を入力...');
    fireEvent.change(textarea, { target: { value: 'First sentence. Second sentence.' } });

    const splitButton = screen.getByText('自動分割');
    fireEvent.click(splitButton);

    const dropArea = screen.getAllByText(/BLOCK/)[0].parentElement;
    if (!dropArea) throw new Error('Drop area not found');

    const rangeMock = { startContainer: document.createTextNode(''), startOffset: 0 } as unknown as Range;
    (document as any).caretRangeFromPoint = jest.fn(() => rangeMock);

    fireEvent.drop(dropArea, { clientX: 0, clientY: 0, preventDefault: jest.fn() });

    const markers = screen.getAllByText(/BLOCK/);
    expect(markers.length).toBeGreaterThan(0);
  });

  // -----------------------
  // 追加テスト
  // -----------------------

  test('splitBySentenceAndWordCount の min/max ワード分岐をカバー', () => {
    render(<PromptView setView={setViewMock} />);

    const longText = Array(500).fill('word').join(' ') + '.';
    const textarea = screen.getByPlaceholderText('ここに文章を入力...');
    fireEvent.change(textarea, { target: { value: longText } });

    const splitButton = screen.getByText('自動分割');
    fireEvent.click(splitButton);

    const markers = screen.getAllByText(/BLOCK/);
    expect(markers.length).toBeGreaterThan(0);
  });

  test('handleDrop の else 分岐（spanなし）をカバー', () => {
    render(<PromptView setView={setViewMock} />);

    const text = 'Hello world.';
    fireEvent.change(screen.getByPlaceholderText('ここに文章を入力...'), { target: { value: text } });

    const splitButton = screen.getByText('自動分割');
    fireEvent.click(splitButton);

    const dropArea = screen.getByText(/BLOCK/).parentElement!;
    dropArea.querySelectorAll('[data-start]').forEach((el) => el.remove());

    (document as any).caretRangeFromPoint = jest.fn(() => null);

    fireEvent.drop(dropArea, { clientX: 0, clientY: 0, preventDefault: jest.fn() });

    const markersAfter = screen.getAllByText(/BLOCK/);
    expect(markersAfter.length).toBeGreaterThan(0);
  });

  test('空文字や trim 後に空になるブロックは生成されない', () => {
    render(<PromptView setView={setViewMock} />);

    const textarea = screen.getByPlaceholderText('ここに文章を入力...');
    fireEvent.change(textarea, { target: { value: '   ' } });

    const splitButton = screen.getByText('自動分割');
    fireEvent.click(splitButton);

    const prompts = screen.queryAllByText(/🧠 抽出プロンプト/);
    expect(prompts.length).toBe(0);
  });

  test('generateFlashcardPrompt のテンプレート出力を確認', () => {
    render(<PromptView setView={setViewMock} />);

    const textarea = screen.getByPlaceholderText('ここに文章を入力...');
    fireEvent.change(textarea, { target: { value: 'Test sentence for prompt.' } });

    const splitButton = screen.getByText('自動分割');
    fireEvent.click(splitButton);

    const promptText = screen.getByText(/🧠 抽出プロンプト/).nextSibling?.textContent || '';
    expect(promptText).toContain('Test sentence for prompt.');
    expect(promptText).toContain('JSONの形式');
  });
});
