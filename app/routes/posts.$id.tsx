import { prisma } from "~/utils/db.server";
import type { Post } from "~/services/posts";
import { HeaderMiddle, Paragraph, Link } from "~/components/Typography";
import { useLoaderData, Outlet, useLocation } from "@remix-run/react";
import { requireAuth } from "~/utils/authGuard.server";
import { useUser } from "~/context/user";
import { format } from "date-fns";

export const loader = async ({
  params,
  request,
}: {
  params: { id: string };
  request: Request;
}) => {
  await requireAuth(request);
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { tags: true, author: { include: { profile: true } } },
  });

  if (!post) {
    throw new Response("", {
      status: 404,
      statusText: "Post not found",
    });
  }

  return Response.json({ post });
};

export default function PostLayout() {
  const { post } = useLoaderData<{ post: Post }>();

  const user = useUser();

  const location = useLocation();

  if (location.pathname.includes(`/${post.id}/edit`)) {
    return <Outlet />;
  }

  const isCurrentUserAuthor = user.id === post.author.id;
  const isPostModified = post.createdAt !== post.modifiedAt;

  return (
    <div className="max-w-screen-xl flex flex-wrap flex-col gap-8 items-center justify-center mx-auto p-4">
      <div className="text-center relative w-full flex justify-between items-end">
        <div className="flex flex-col gap-1 items-start">
          <span className="text-sm text-gray-900 dark:text-white">
            {`Created by ${post.author.profile?.firstName} ${post.author.profile?.lastName} on ${format(post.createdAt, "MMM dd yyyy")}`}
          </span>
          {isPostModified && (
            <span className="text-sm text-gray-900 dark:text-white">
              {`Modified on ${format(post.modifiedAt, "MMM dd yyyy")}`}
            </span>
          )}
        </div>
        <HeaderMiddle>{post.title}</HeaderMiddle>
        {isCurrentUserAuthor && (
          <Link to={`/posts/${post.id}/edit`}>Edit post</Link>
        )}
      </div>
      <Paragraph>
        <img
          className="h-auto w-1/2 rounded-lg float-left"
          src={`/uploads/${post.photoLink}`}
          alt="post"
        />
        {post.body}
      </Paragraph>
    </div>
  );
}
