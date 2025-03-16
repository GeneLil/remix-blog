import { prisma } from "~/utils/db.server";
import { useFetcher, useParams } from "@remix-run/react";
import { type Comment } from "~/services/posts";
import { FormTextarea } from "~/components/FormTextarea";
import { ValidatedForm } from "remix-validated-form";
import { getUser } from "~/utils/auth.server";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { requireAuth } from "~/utils/authGuard.server";
import { HeaderSmall } from "~/components/Typography";
import { format } from "date-fns";
import { useUserImage } from "~/context/user";

const addCommentValidator = withZod(
  z.object({
    comment: z.string().min(1, { message: "Comment is required" }),
  }),
);

export const action = async ({
  request,
}: {
  request: Request;
  params: { postId: string };
}) => {
  const formData = await request.formData();
  const commentBody = String(formData.get("comment"));
  const postId = String(formData.get("postId"));
  const user = await getUser(request);

  if (user) {
    const comment = await prisma.comment.create({
      data: {
        body: commentBody,
        author: { connect: { id: user.id } },
        post: { connect: { id: postId } },
      },
    });
    return Response.json({ comment });
  }
  return null;
};

export const loader = async ({
  request,
  params,
}: {
  request: Request;
  params: { postId: string };
}) => {
  await requireAuth(request);
  const comments = await prisma.comment.findMany({
    where: { postId: params.postId },
    include: { author: { include: { profile: true } } },
  });
  return Response.json({ comments });
};

const Comment = ({ comment }: { comment: Comment }) => {
  const author = comment.author;
  const profile = author.profile;
  const userImage = useUserImage(author.profile?.photoLink);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between w-full">
        <div className="flex items-center mb-4">
          <img className="w-10 h-10 me-4 rounded-full" src={userImage} alt="" />
          <div className="font-medium dark:text-white">
            <p>
              {profile?.firstName} {profile?.lastName}
              <time
                dateTime={author.createdAt}
                className="block text-sm text-gray-500 dark:text-gray-400"
              >
                Joined on {format(author.createdAt, "yyyy, MMMM dd")}
              </time>
            </p>
          </div>
        </div>
        <footer className="mb-5 text-sm text-gray-500 dark:text-gray-400">
          <p>
            Commented on{" "}
            <time dateTime={comment.createdAt}>
              {format(comment.createdAt, "kk:mm:ss, MMMM dd, yyyy")}
            </time>
          </p>
        </footer>
      </div>
      <p className="mb-2 text-gray-500 dark:text-gray-400">{comment.body}</p>
    </div>
  );
};

const Comments = ({ comments }: { comments: Comment[] }) => {
  const commentFetcher = useFetcher();
  const { id } = useParams();
  return (
    <div className="flex flex-col gap-8">
      <HeaderSmall>Comments</HeaderSmall>
      {comments.length ? (
        <div className="flex flex-col gap-8">
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        "No comments yet, be the first to comment!"
      )}
      <ValidatedForm
        fetcher={commentFetcher}
        validator={addCommentValidator}
        method="POST"
        className="w-[800px]"
        action="/comments"
      >
        <div className="mb-5">
          <FormTextarea label="Add comment" id="comment" name="comment" />
          <input type="hidden" name="postId" value={id} />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Add
        </button>
      </ValidatedForm>
    </div>
  );
};

export default Comments;
