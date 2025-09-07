// src/test/savePrompts.test.ts
import { savePromptsToFile } from "../components/savePrompts";

describe("savePromptsToFile", () => {
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;
  let clickMock: jest.Mock;

  beforeEach(() => {
    clickMock = jest.fn();
    URL.createObjectURL = jest.fn(() => "blob:mock-url");
    URL.revokeObjectURL = jest.fn();

    // document.createElement("a") のモック
    jest.spyOn(document, "createElement").mockImplementation((tagName: string) => {
      if (tagName === "a") {
        return {
          href: "",
          download: "",
          click: clickMock,
        } as unknown as HTMLAnchorElement;
      }
      return document.createElement(tagName);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
  });

  test("プロンプト配列から正しいファイル名と内容でダウンロードされる", () => {
    const mockPrompts = ["prompt1", "prompt2"];
    jest.useFakeTimers().setSystemTime(new Date("2025-09-07T12:34:56Z"));

    savePromptsToFile(mockPrompts);

    // createObjectURL が呼ばれている
    expect(URL.createObjectURL).toHaveBeenCalled();
    // a.click が呼ばれている
    expect(clickMock).toHaveBeenCalled();
    // revokeObjectURL が呼ばれている
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");

    jest.useRealTimers();
  });
});
