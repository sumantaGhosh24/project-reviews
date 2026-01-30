"use client";

import Link from "next/link";

import {buttonVariants} from "@/components/ui/button";
import ComponentWrapper from "@/features/global/components/component-wrapper";
import SearchBarComponent from "@/features/global/components/search-bar-component";

import CategoriesTable from "./categories-table";

const ManageCategories = () => {
  return (
    <ComponentWrapper
      title="Manage Categories"
      description="Admin manage all categories."
      button={
        <Link href="/category/create" className={buttonVariants()}>
          Create Category
        </Link>
      }
      search={<SearchBarComponent placeholder="Search categories" />}
      table={<CategoriesTable />}
    />
  );
};

export default ManageCategories;
