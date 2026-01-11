"use client";

import {useEntitySearch} from "@/hooks/use-entity-search";
import {SearchBar} from "@/components/entity-components";

import {useProfileParams} from "../hooks/use-profile-params";

const SearchUser = () => {
  const [params, setParams] = useProfileParams();

  const {searchValue, onSearchChange} = useEntitySearch({
    params,
    setParams,
  });

  return (
    <SearchBar
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      placeholder="Search users"
    />
  );
};

export default SearchUser;
