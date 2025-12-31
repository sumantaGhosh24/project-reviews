"use client";

import {useRouter} from "next/navigation";
import Image from "next/image";
import {formatDistanceToNowStrict} from "date-fns";
import {PenIcon} from "lucide-react";

import {
  EmptyComponent,
  PaginationComponent,
} from "@/components/entity-components";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";

import {useCategoriesParams} from "../hooks/use-categories-params";
import DeleteCategory from "./delete-category";

const CategoriesTable = () => {
  const router = useRouter();

  // TODO:
  const categories = {
    items: [
      {
        id: "1",
        name: "Category 1",
        imageUrl: "https://placehold.co/600x400.png",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Category 2",
        imageUrl: "https://placehold.co/600x400.png",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        name: "Category 3",
        imageUrl: "https://placehold.co/600x400.png",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "4",
        name: "Category 4",
        imageUrl: "https://placehold.co/600x400.png",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "5",
        name: "Category 5",
        imageUrl: "https://placehold.co/600x400.png",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    totalPages: 1,
    page: 1,
  };
  const isFetching = false;

  const [params, setParams] = useCategoriesParams();

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
                <TableHead>Image</TableHead>
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Image
                          src={cat.imageUrl as string}
                          alt="category image"
                          height={50}
                          width={50}
                          className="h-12 animate-pulse cursor-pointer"
                        />
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Category Image</DialogTitle>
                          <DialogDescription>
                            View the image of this category.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center space-x-2">
                          <Image
                            src={cat.imageUrl as string}
                            alt="category image"
                            height={250}
                            width={300}
                            className="h-[300px] w-full rounded"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
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
