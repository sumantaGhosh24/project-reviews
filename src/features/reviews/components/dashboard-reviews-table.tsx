"use client";

import Link from "next/link";
import {formatDistanceToNowStrict} from "date-fns";
import {
  LinkIcon,
  StarIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";

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

import {useSuspenseMyReviews} from "../hooks/use-reviews";

const DashboardReviewsTable = () => {
  const {data: reviews, isFetching} = useSuspenseMyReviews();

  const [params, setParams] = useGlobalParams();

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
                <TableHead>Up Votes</TableHead>
                <TableHead>Down Votes</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Release</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.items.map((review) => {
                const upVote =
                  review.votes.find((v) => v.type === "UP")?._count ?? 0;
                const downVote =
                  review.votes.find((v) => v.type === "DOWN")?._count ?? 0;

                return (
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
                        {Array.from({length: 5 - review.rating}).map(
                          (_, ind) => (
                            <StarIcon
                              key={ind}
                              className="text-muted-foreground"
                            />
                          )
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {review.feedback.length > 50
                        ? review.feedback.substring(0, 50) + "..."
                        : review.feedback}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-green-500">
                        <TrendingUpIcon size={24} />
                        {upVote}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-red-500">
                        <TrendingDownIcon size={24} />
                        {downVote}
                      </div>
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
                );
              })}
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
