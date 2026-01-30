"use client";

import ComponentWrapper from "@/features/global/components/component-wrapper";
import SearchBarComponent from "@/features/global/components/search-bar-component";
import FilterComponent from "@/features/global/components/filter-component";

import ProjectsTable from "./projects-table";

const ManageProjects = () => {
  return (
    <ComponentWrapper
      title="Manage Projects"
      description="Admin manage all projects."
      search={<SearchBarComponent placeholder="Search projects" />}
      filter={<FilterComponent />}
      table={<ProjectsTable />}
    />
  );
};

export default ManageProjects;
