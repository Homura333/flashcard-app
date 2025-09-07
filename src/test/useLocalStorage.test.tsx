// src/test/useLocalStorage.test.tsx
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "../hooks/useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("初期値を返す", () => {
    const { result } = renderHook(() => useLocalStorage("key", "初期値"));
    expect(result.current[0]).toBe("初期値");
  });

  it("値を更新するとlocalStorageに保存される", () => {
    const { result } = renderHook(() => useLocalStorage("key", "初期値"));
    
    act(() => {
      result.current[1]("新しい値");
    });

    expect(result.current[0]).toBe("新しい値");
    expect(localStorage.getItem("key")).toBe(JSON.stringify("新しい値"));
  });

  it("既存のlocalStorage値を読み込む", () => {
    localStorage.setItem("key", JSON.stringify("保存済み値"));

    const { result } = renderHook(() => useLocalStorage("key", "初期値"));

    expect(result.current[0]).toBe("保存済み値");
  });

  it("不正なJSONでも初期値を返す", () => {
    localStorage.setItem("key", "{ invalid json");

    const { result } = renderHook(() => useLocalStorage("key", "初期値"));

    expect(result.current[0]).toBe("初期値");
  });
});
