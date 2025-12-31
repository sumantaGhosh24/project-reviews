import {useEntitySearch} from "@/hooks/use-entity-search";
import {SearchBar} from "@/components/entity-components";

import {useCategoriesParams} from "../hooks/use-categories-params";

const SearchCategory = () => {
  const [params, setParams] = useCategoriesParams();

  const {searchValue, onSearchChange} = useEntitySearch({
    params,
    setParams,
  });

  return (
    <SearchBar
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      placeholder="Search categories"
    />
  );
};

export default SearchCategory;
