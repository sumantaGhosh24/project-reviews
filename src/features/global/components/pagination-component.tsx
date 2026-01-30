"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

const PaginationComponent = ({
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

export default PaginationComponent;
