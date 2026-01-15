"use client";

import {ComponentWrapper} from "@/components/entity-components";

import SearchProject from "./search-project";
import FilterCategory from "./filter-category";
import ProjectsTable from "./projects-table";

const ManageProjects = () => {
  return (
    <ComponentWrapper
      title="Manage Projects"
      description="Admin manage all projects."
      search={<SearchProject />}
      filter={<FilterCategory />}
      table={<ProjectsTable />}
    />
  );
};

export default ManageProjects;
