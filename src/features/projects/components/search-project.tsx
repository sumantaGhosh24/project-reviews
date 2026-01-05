import {useEntitySearch} from "@/hooks/use-entity-search";
import {SearchBar} from "@/components/entity-components";

import {useProjectsParams} from "../hooks/use-projects-params";

const SearchProject = () => {
  const [params, setParams] = useProjectsParams();

  const {searchValue, onSearchChange} = useEntitySearch({
    params,
    setParams,
  });

  return (
    <SearchBar
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      placeholder="Search projects"
    />
  );
};

export default SearchProject;
