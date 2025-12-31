"use client";

import Link from "next/link";

import {buttonVariants} from "@/components/ui/button";

import {ComponentWrapper} from "@/components/entity-components";

import SearchCategory from "./search-category";
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
      search={<SearchCategory />}
      table={<CategoriesTable />}
    />
  );
};

export default ManageCategories;
