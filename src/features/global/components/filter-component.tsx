"use client";

import {useSuspenseAllCategories} from "@/features/categories/hooks/use-categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {useGlobalParams} from "../hooks/use-global-params";
import {useEntityFilter} from "../hooks/use-entity-filter";

const FilterComponent = () => {
  const [params, setParams] = useGlobalParams();

  const {filterValue, onFilterChange} = useEntityFilter({
    params,
    setParams,
  });

  const {data: categories} = useSuspenseAllCategories();

  return (
    <Select
      value={filterValue}
      onValueChange={(value) => onFilterChange(value)}
    >
      <SelectTrigger className="py-6 w-full">
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {categories.map((category) => (
          <SelectItem value={category.name} key={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FilterComponent;
