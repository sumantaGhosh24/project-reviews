"use client";

import {useEntityFilter} from "@/hooks/use-entity-filter";
import {FilterComponent} from "@/components/entity-components";

import {useProjectsParams} from "../hooks/use-projects-params";

const FilterCategory = () => {
  const [params, setParams] = useProjectsParams();

  const {filterValue, onFilterChange} = useEntityFilter({
    params,
    setParams,
  });

  // TODO:
  const categories = [
    {id: "1", name: "Category 1", imageUrl: "https://placehold.co/600x400.png"},
    {id: "2", name: "Category 2", imageUrl: "https://placehold.co/600x400.png"},
    {id: "3", name: "Category 3", imageUrl: "https://placehold.co/600x400.png"},
  ];

  return (
    <FilterComponent
      filterValue={filterValue}
      onFilterChange={onFilterChange}
      categories={categories}
    />
  );
};

export default FilterCategory;
