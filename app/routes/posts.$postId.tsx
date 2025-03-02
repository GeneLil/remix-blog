import { prisma } from "~/utils/db.server";
import type { Post } from "~/services/posts";
import { HeaderMiddle, Paragraph } from "~/components/Typography";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ params }: { params: { postId: string } }) => {
  const postId = params.postId;
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { tags: true },
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
  const {
    post: { title, body, photoLink },
  } = useLoaderData<{ post: Post }>();

  return (
    <div className="max-w-screen-xl flex flex-wrap flex-col gap-8 items-center justify-center mx-auto p-4">
      <HeaderMiddle>{title}</HeaderMiddle>
      <img
        className="h-auto max-w-full rounded-lg"
        src={`/uploads/${photoLink}`}
        alt="post"
      />

      <Paragraph>{body}</Paragraph>
    </div>
  );
}
