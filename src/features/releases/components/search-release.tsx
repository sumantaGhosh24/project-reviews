import {useEntitySearch} from "@/hooks/use-entity-search";
import {SearchBar} from "@/components/entity-components";

import {useReleasesParams} from "../hooks/use-releases-params";

const SearchRelease = () => {
  const [params, setParams] = useReleasesParams();

  const {searchValue, onSearchChange} = useEntitySearch({
    params,
    setParams,
  });

  return (
    <SearchBar
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      placeholder="Search releases"
    />
  );
};

export default SearchRelease;
