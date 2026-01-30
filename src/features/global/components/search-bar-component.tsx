"use client";

import {SearchIcon} from "lucide-react";

import {Input} from "@/components/ui/input";

import {useGlobalParams} from "../hooks/use-global-params";
import {useEntitySearch} from "../hooks/use-entity-search";

interface SearchBarProps {
  placeholder: string;
}

const SearchBarComponent = ({placeholder}: SearchBarProps) => {
  const [params, setParams] = useGlobalParams();

  const {searchValue, onSearchChange} = useEntitySearch({
    params,
    setParams,
  });

  return (
    <div className="relative">
      <SearchIcon className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="w-full bg-background shadow-none border-border pl-8 py-5"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBarComponent;
