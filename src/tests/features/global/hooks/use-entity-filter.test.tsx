import {renderHook, act} from "@testing-library/react";

import {PAGINATION} from "@/constants/pagination";
import {useEntityFilter} from "@/features/global/hooks/use-entity-filter";

describe("useEntityFilter", () => {
  const mockSetParams = jest.fn();
  const defaultParams = {category: "", page: 1};

  beforeEach(() => {
    jest.useFakeTimers();
    mockSetParams.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("initializes with the provided category value", () => {
    const {result} = renderHook(() =>
      useEntityFilter({
        params: {category: "initial", page: 1},
        setParams: mockSetParams,
      })
    );

    expect(result.current.filterValue).toBe("initial");
  });

  it("updates local filter value immediately on change", () => {
    const {result} = renderHook(() =>
      useEntityFilter({
        params: defaultParams,
        setParams: mockSetParams,
      })
    );

    act(() => {
      result.current.onFilterChange("new category");
    });

    expect(result.current.filterValue).toBe("new category");
    expect(mockSetParams).not.toHaveBeenCalled();
  });

  it("calls setParams after debounce delay", () => {
    const {result} = renderHook(() =>
      useEntityFilter({
        params: defaultParams,
        setParams: mockSetParams,
        debounceMs: 500,
      })
    );

    act(() => {
      result.current.onFilterChange("new category");
    });

    expect(mockSetParams).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockSetParams).toHaveBeenCalledWith({
      category: "new category",
      page: PAGINATION.DEFAULT_PAGE,
    });
  });

  it("handles clearing the filter immediately", () => {
    const {result} = renderHook(() =>
      useEntityFilter({
        params: {category: "something", page: 1},
        setParams: mockSetParams,
      })
    );

    act(() => {
      result.current.onFilterChange("");
    });

    expect(mockSetParams).toHaveBeenCalledWith({
      category: "",
      page: PAGINATION.DEFAULT_PAGE,
    });
  });

  it("resets category to empty when 'all' is passed in params", () => {
    renderHook(() =>
      useEntityFilter({
        params: {category: "all", page: 5},
        setParams: mockSetParams,
      })
    );

    expect(mockSetParams).toHaveBeenCalledWith({
      category: "",
      page: PAGINATION.DEFAULT_PAGE,
    });
  });

  it("updates local filter when params.category changes externally", () => {
    const {result, rerender} = renderHook(
      ({category}) =>
        useEntityFilter({
          params: {category, page: 1},
          setParams: mockSetParams,
        }),
      {initialProps: {category: "old"}}
    );

    expect(result.current.filterValue).toBe("old");

    rerender({category: "new"});

    expect(result.current.filterValue).toBe("new");
  });
});
