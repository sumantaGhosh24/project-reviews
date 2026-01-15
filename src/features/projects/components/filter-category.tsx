"use client";

import {useEntityFilter} from "@/hooks/use-entity-filter";
import {useSuspenseAllCategories} from "@/features/categories/hooks/use-categories";
import {FilterComponent} from "@/components/entity-components";

import {useProjectsParams} from "../hooks/use-projects-params";

const FilterCategory = () => {
  const [params, setParams] = useProjectsParams();

  const {filterValue, onFilterChange} = useEntityFilter({
    params,
    setParams,
  });

  const {data: categories} = useSuspenseAllCategories();

  return (
    <FilterComponent
      filterValue={filterValue}
      onFilterChange={onFilterChange}
      categories={categories}
    />
  );
};

export default FilterCategory;
