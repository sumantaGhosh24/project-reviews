"use client";

import Link from "next/link";
import {formatDistanceToNowStrict} from "date-fns";
import {LinkIcon, StarIcon} from "lucide-react";

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
import {Button} from "@/components/ui/button";

import {useSuspenseMyReviews} from "../hooks/use-reviews";
import {useReviewsParams} from "../hooks/use-reviews-params";

const DashboardReviewsTable = () => {
  const {data: reviews, isFetching} = useSuspenseMyReviews();

  const [params, setParams] = useReviewsParams();

  return (
    <>
      {reviews.items.length > 0 ? (
        <div className="flex flex-col items-center gap-10">
          <Table>
            <TableCaption>A list of your reviews.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Id</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Release</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.items.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">{review.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {Array.from({length: review.rating}).map((_, ind) => (
                        <StarIcon
                          key={ind}
                          className="text-orange-500 fill-orange-500"
                        />
                      ))}
                      {Array.from({length: 5 - review.rating}).map((_, ind) => (
                        <StarIcon key={ind} className="text-muted-foreground" />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {review.feedback.length > 50
                      ? review.feedback.substring(0, 50) + "..."
                      : review.feedback}
                  </TableCell>
                  <TableCell>
                    <Button asChild>
                      <Link href={`/profile/details/${review.author.id}`}>
                        <LinkIcon size={24} /> Visit Author
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button asChild>
                      <Link
                        href={`/project/details/${review.release.project.id}/release/${review.release.id}`}
                      >
                        <LinkIcon size={24} /> Visit Release
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNowStrict(review.createdAt, {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNowStrict(review.updatedAt, {
                      addSuffix: true,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {reviews.totalPages > 1 && (
            <PaginationComponent
              page={reviews?.page}
              totalPages={reviews.totalPages}
              onPageChange={(page) => setParams({...params, page})}
              disabled={isFetching}
            />
          )}
        </div>
      ) : (
        <EmptyComponent
          title="No Review Found"
          description="Try again later"
          buttonText="Go Home"
          redirectUrl="/home"
        />
      )}
    </>
  );
};

export default DashboardReviewsTable;
