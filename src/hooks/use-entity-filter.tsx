import {useEffect, useState} from "react";

import {PAGINATION} from "@/constants/pagination";

interface UseEntityFilterProps<
  T extends {
    category: string;
    page: number;
  }
> {
  params: T;
  setParams: (params: T) => void;
  debounceMs?: number;
}

export function useEntityFilter<T extends {category: string; page: number}>({
  params,
  setParams,
  debounceMs = 500,
}: UseEntityFilterProps<T>) {
  const [localCategory, setLocalCategory] = useState(params.category);

  useEffect(() => {
    if (localCategory === "" && params.category !== "") {
      setParams({...params, category: "", page: PAGINATION.DEFAULT_PAGE});
      return;
    }

    if (params.category === "all") {
      setParams({...params, category: "", page: PAGINATION.DEFAULT_PAGE});
      return;
    }

    const timer = setTimeout(() => {
      if (localCategory !== params.category) {
        setParams({
          ...params,
          category: localCategory,
          page: PAGINATION.DEFAULT_PAGE,
        });
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localCategory, params, setParams, debounceMs]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalCategory(params.category);
  }, [params.category]);

  return {filterValue: localCategory, onFilterChange: setLocalCategory};
}
