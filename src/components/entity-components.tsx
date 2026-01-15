"use client";

import {type ReactNode} from "react";
import {useRouter} from "next/navigation";
import {
  AlertCircleIcon,
  FolderCodeIcon,
  LoaderIcon,
  SearchIcon,
} from "lucide-react";

import {cn} from "@/lib/utils";
import {Category} from "@/generated/prisma/client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ComponentWrapperProps {
  title: string;
  description: string;
  button?: ReactNode;
  search?: ReactNode;
  filter?: ReactNode;
  table?: ReactNode;
  className?: string;
}

export const ComponentWrapper = ({
  title,
  description,
  button,
  search,
  filter,
  table,
  className,
}: ComponentWrapperProps) => {
  return (
    <div
      className={cn(
        "mx-auto my-20 w-[95%] rounded-md shadow-md p-5 bg-background dark:shadow-white/40",
        className
      )}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="text-left">
          <h2 className="mb-4 text-3xl font-bold">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
        {button && button}
      </div>
      {search && <div className="mb-8">{search}</div>}
      {filter && <div className="mb-8">{filter}</div>}
      {table && table}
    </div>
  );
};

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export const PaginationComponent = ({
  page,
  totalPages,
  onPageChange,
  disabled,
}: PaginationProps) => {
  const previousDisabled = page === 1 || disabled;
  const nextDisabled = page === totalPages || totalPages === 0 || disabled;

  return (
    <div className="flex items-center justify-between gap-x-2 w-full">
      <div className="flex-1 text-sm text-muted-foreground">
        Page {page} of {totalPages || 1}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  previousDisabled ? null : onPageChange(Math.max(1, page - 1))
                }
                aria-disabled={previousDisabled}
                className={`${
                  previousDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  nextDisabled
                    ? null
                    : onPageChange(Math.min(totalPages, page + 1))
                }
                aria-disabled={nextDisabled}
                className={`${
                  nextDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

interface EmptyComponentProps {
  title: string;
  description: string;
  buttonText: string;
  redirectUrl: string;
}

export const EmptyComponent = ({
  title,
  description,
  buttonText,
  redirectUrl,
}: EmptyComponentProps) => {
  const router = useRouter();

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderCodeIcon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button onClick={() => router.push(redirectUrl)}>{buttonText}</Button>
        </div>
      </EmptyContent>
    </Empty>
  );
};

interface ErrorComponentProps {
  title: string;
  description: string;
  buttonText: string;
  redirectUrl: string;
}

export const ErrorComponent = ({
  title,
  description,
  buttonText,
  redirectUrl,
}: ErrorComponentProps) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <Empty className="shadow-md container mx-auto h-[450px] dark:shadow-gray-200">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertCircleIcon />
          </EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(redirectUrl)}>
              {buttonText}
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
};

export const LoadingComponent = () => {
  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <Empty className="shadow-md container mx-auto h-[450px] dark:shadow-gray-200">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LoaderIcon className="animate-spin" />
          </EmptyMedia>
          <EmptyTitle>Loading...</EmptyTitle>
          <EmptyDescription>Please wait</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
};

interface SearchBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder: string;
}

export const SearchBar = ({
  searchValue,
  onSearchChange,
  placeholder,
}: SearchBarProps) => {
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

interface FilterComponentProps {
  filterValue: string;
  onFilterChange: (value: string) => void;
  categories: Category[];
}

export const FilterComponent = ({
  filterValue,
  onFilterChange,
  categories,
}: FilterComponentProps) => {
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
