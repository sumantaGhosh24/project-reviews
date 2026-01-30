"use client";

import {useRouter} from "next/navigation";
import {formatDistanceToNowStrict} from "date-fns";
import {PenIcon} from "lucide-react";

import {useGlobalParams} from "@/features/global/hooks/use-global-params";
import PaginationComponent from "@/features/global/components/pagination-component";
import EmptyComponent from "@/features/global/components/empty-component";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {Button} from "@/components/ui/button";

import {useSuspenseCategories} from "../hooks/use-categories";
import DeleteCategory from "./delete-category";

const CategoriesTable = () => {
  const router = useRouter();

  const {data: categories, isFetching} = useSuspenseCategories();

  const [params, setParams] = useGlobalParams();

  return (
    <>
      {categories.items.length > 0 ? (
        <div className="flex flex-col items-center gap-10">
          <Table>
            <TableCaption>A list of all categories.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.items.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.id}</TableCell>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>
                    {formatDistanceToNowStrict(cat.createdAt, {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNowStrict(cat.updatedAt, {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Button
                      variant="success"
                      onClick={() => router.push(`/category/update/${cat.id}`)}
                    >
                      <PenIcon size={24} />
                      Update
                    </Button>
                    <DeleteCategory id={cat.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {categories.totalPages > 1 && (
            <PaginationComponent
              page={categories?.page}
              totalPages={categories.totalPages}
              onPageChange={(page) => setParams({...params, page})}
              disabled={isFetching}
            />
          )}
        </div>
      ) : (
        <EmptyComponent
          title="No Category Found"
          description="Try again later"
          buttonText="Create Category"
          redirectUrl="/category/create"
        />
      )}
    </>
  );
};

export default CategoriesTable;
