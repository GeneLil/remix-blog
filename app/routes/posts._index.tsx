import { prisma } from "~/utils/db.server";
import { Link, useLoaderData } from "@remix-run/react";
import { Card } from "~/components/Card";
import { TagComponent } from "~/components/Tag";
import type { Tag } from "~/services/tag";
import type { Post } from "~/services/posts";
import { requireAuth } from "~/utils/authGuard.server";

export const loader = async ({ request }: { request: Request }) => {
  await requireAuth(request);
  const posts = await prisma.post.findMany({ include: { tags: true } });

  return Response.json({ posts });
};

const NoPosts = () => <p className="">There are no posts yet!</p>;

const PostsList = ({ posts }: { posts: Post[] }) => {
  const CardFooter = ({ tags }: { tags: Tag[] }) => {
    return (
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <TagComponent key={tag.id} tag={tag} />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-row flex-wrap gap-6 content-center">
      {posts.map((post) => (
        <Card
          key={post.id}
          postId={post.id}
          title={post.title}
          body={post.body}
          imgSrc={`/uploads/${post.photoLink}`}
          footer={<CardFooter tags={post.tags} />}
        />
      ))}
    </div>
  );
};

export default function PostsGrid() {
  const { posts, error } = useLoaderData<{
    posts: Post[];
    error?: string;
  }>();

  return (
    <div className="flex flex-wrap gap-8 items-center justify-center p-4">
      {posts && posts.length ? <PostsList posts={posts} /> : <NoPosts />}
      {error && <p className="text-red-600">{error}</p>}
      <Link to="/posts/create">Create new post</Link>
    </div>
  );
}
