import {renderHook, act} from "@testing-library/react";

import {PAGINATION} from "@/constants/pagination";
import {useEntitySearch} from "@/features/global/hooks/use-entity-search";

describe("useEntitySearch", () => {
  const mockSetParams = jest.fn();
  const defaultParams = {search: "", page: 1};

  beforeEach(() => {
    jest.useFakeTimers();
    mockSetParams.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("initializes with the provided search value", () => {
    const {result} = renderHook(() =>
      useEntitySearch({
        params: {search: "initial", page: 1},
        setParams: mockSetParams,
      })
    );

    expect(result.current.searchValue).toBe("initial");
  });

  it("updates local search value immediately on change", () => {
    const {result} = renderHook(() =>
      useEntitySearch({
        params: defaultParams,
        setParams: mockSetParams,
      })
    );

    act(() => {
      result.current.onSearchChange("new search");
    });

    expect(result.current.searchValue).toBe("new search");
    expect(mockSetParams).not.toHaveBeenCalled();
  });

  it("calls setParams after debounce delay", () => {
    const {result} = renderHook(() =>
      useEntitySearch({
        params: defaultParams,
        setParams: mockSetParams,
        debounceMs: 500,
      })
    );

    act(() => {
      result.current.onSearchChange("new search");
    });

    expect(mockSetParams).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockSetParams).toHaveBeenCalledWith({
      search: "new search",
      page: PAGINATION.DEFAULT_PAGE,
    });
  });

  it("resets page to default when search changes", () => {
    const {result} = renderHook(() =>
      useEntitySearch({
        params: {search: "", page: 5},
        setParams: mockSetParams,
      })
    );

    act(() => {
      result.current.onSearchChange("new search");
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockSetParams).toHaveBeenCalledWith({
      search: "new search",
      page: PAGINATION.DEFAULT_PAGE,
    });
  });

  it("updates local search when params.search changes externally", () => {
    const {result, rerender} = renderHook(
      ({search}) =>
        useEntitySearch({
          params: {search, page: 1},
          setParams: mockSetParams,
        }),
      {initialProps: {search: "old"}}
    );

    expect(result.current.searchValue).toBe("old");

    rerender({search: "new"});

    expect(result.current.searchValue).toBe("new");
  });

  it("handles clearing the search immediately", () => {
    const {result} = renderHook(() =>
      useEntitySearch({
        params: {search: "something", page: 1},
        setParams: mockSetParams,
      })
    );

    act(() => {
      result.current.onSearchChange("");
    });

    expect(mockSetParams).toHaveBeenCalledWith({
      search: "",
      page: PAGINATION.DEFAULT_PAGE,
    });
  });
});
