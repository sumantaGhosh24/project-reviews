"use client";

import Link from "next/link";
import {formatDistanceToNowStrict} from "date-fns";
import {LinkIcon} from "lucide-react";

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
import {Badge} from "@/components/ui/badge";

import {useSuspenseMyComments} from "../hooks/use-comments";
import {useCommentsParams} from "../hooks/use-comments-params";

const DashboardCommentsTable = () => {
  const {data: comments, isFetching} = useSuspenseMyComments();

  const [params, setParams] = useCommentsParams();

  return (
    <>
      {comments.items.length > 0 ? (
        <div className="flex flex-col items-center gap-10">
          <Table>
            <TableCaption>A list of your comments.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Id</TableHead>
                <TableHead>Body</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Release</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Replies</TableHead>
                <TableHead>Deleted At</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.items.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className="font-medium">{comment.id}</TableCell>
                  <TableCell>
                    {comment.body.length > 50
                      ? comment.body.substring(0, 50) + "..."
                      : comment.body}
                  </TableCell>
                  <TableCell>
                    <Button asChild>
                      <Link href={`/profile/details/${comment.author.id}`}>
                        <LinkIcon size={24} /> Visit Author
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button asChild>
                      <Link
                        href={`/project/details/${comment.release.project.id}/release/${comment.release.id}`}
                      >
                        <LinkIcon size={24} /> Visit Release
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell>
                    {comment.parentId !== null ? (
                      comment.parentId
                    ) : (
                      <Badge variant="success" className="uppercase">
                        No Parent
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{comment.replies.length}</TableCell>
                  <TableCell>
                    {comment?.deletedAt ? (
                      formatDistanceToNowStrict(comment?.deletedAt, {
                        addSuffix: true,
                      })
                    ) : (
                      <Badge variant="success" className="uppercase">
                        Not Deleted
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNowStrict(comment.createdAt, {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNowStrict(comment.updatedAt, {
                      addSuffix: true,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {comments.totalPages > 1 && (
            <PaginationComponent
              page={comments?.page}
              totalPages={comments.totalPages}
              onPageChange={(page) => setParams({...params, page})}
              disabled={isFetching}
            />
          )}
        </div>
      ) : (
        <EmptyComponent
          title="No Comment Found"
          description="Try again later"
          buttonText="Go Home"
          redirectUrl="/home"
        />
      )}
    </>
  );
};

export default DashboardCommentsTable;
