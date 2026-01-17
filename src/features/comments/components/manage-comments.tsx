import {CommentList} from "./comment-list";
import {CreateCommentForm} from "./create-comment-form";

interface ManageCommentsProps {
  releaseId: string;
}

const ManageComments = ({releaseId}: ManageCommentsProps) => {
  return (
    <div>
      <h2 className="text-xl font-bold">All Comments</h2>
      <CommentList releaseId={releaseId} />
      <CreateCommentForm releaseId={releaseId} />
    </div>
  );
};

export default ManageComments;
