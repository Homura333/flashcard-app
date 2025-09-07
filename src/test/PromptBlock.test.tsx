// src/test/PromptBlock.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import PromptBlock from "../components/PromptBlock";

describe("PromptBlock Component", () => {
  const samplePrompt = "This is a test prompt.";
  const title = "テストプロンプト";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("タイトルとテキストエリアが表示される", () => {
    render(<PromptBlock title={title} prompt={samplePrompt} />);

    expect(screen.getByText(title)).toBeInTheDocument();
    const textarea = screen.getByDisplayValue(samplePrompt) as HTMLTextAreaElement;
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute("readOnly");
  });

  test("コピー用ボタンが有効でクリック時にクリップボードにコピーされる", () => {
    const writeTextMock = jest.fn();
    // @ts-ignore
    navigator.clipboard = { writeText: writeTextMock };

    render(<PromptBlock title={title} prompt={samplePrompt} />);

    const copyButton = screen.getByText("📋 コピー");
    expect(copyButton).not.toBeDisabled();

    fireEvent.click(copyButton);
    expect(writeTextMock).toHaveBeenCalledWith(samplePrompt);
  });

  test("コピー用ボタンが disabled の場合はクリックしてもコピーされない", () => {
    const writeTextMock = jest.fn();
    // @ts-ignore
    navigator.clipboard = { writeText: writeTextMock };

    render(<PromptBlock title={title} prompt={samplePrompt} disabled />);

    const copyButton = screen.getByText("📋 コピー");
    expect(copyButton).toBeDisabled();

    fireEvent.click(copyButton);
    expect(writeTextMock).not.toHaveBeenCalled();
  });

  test("ChatGPTリンクが正しく表示され、disabled時は操作できない", () => {
    const { rerender } = render(
      <PromptBlock title={title} prompt={samplePrompt} disabled={false} />
    );

    // 複数要素対応
    const links = screen.getAllByText("ChatGPTで開く") as HTMLAnchorElement[];
    const link = links[0];
    expect(link).toHaveAttribute("href", "https://chat.openai.com/");
    expect(link).not.toHaveClass("pointer-events-none");

    // disabled に更新して再レンダリング
    rerender(<PromptBlock title={title} prompt={samplePrompt} disabled />);
    const linksDisabled = screen.getAllByText("ChatGPTで開く") as HTMLAnchorElement[];
    const linkDisabled = linksDisabled[0];
    expect(linkDisabled).toHaveClass("pointer-events-none");
  });
});
