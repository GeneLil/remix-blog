import { prisma } from "~/utils/db.server";
import { useLoaderData } from "@remix-run/react";
import { Link, HeaderMiddle } from "~/components/Typography";
import { Card } from "~/components/Card";
import type { Tag } from "~/services/tag";
import type { Post } from "~/services/posts";
import { requireAuth } from "~/utils/authGuard.server";

export const loader = async ({ request }: { request: Request }) => {
  await requireAuth(request);
  const url = new URL(request.url);
  const tag = url.searchParams.get("tag");
  const posts = await prisma.post.findMany({
    include: { tags: true },
    where: tag ? { tags: { some: { name: tag } } } : undefined,
  });
  return Response.json({ posts, tag });
};

const NoPosts = () => <p className="">There are no posts yet!</p>;

const PostsList = ({ posts }: { posts: Post[] }) => {
  const CardFooter = ({ tags }: { tags: Tag[] }) => {
    return (
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link key={tag.id} to={`/posts/?tag=${tag.name}`}>
            {tag.name}
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full grid grid-cols-3 gap-6 justify-center">
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
  const { posts, tag } = useLoaderData<{
    posts: Post[];
    tag?: string;
  }>();

  return (
    <div className="flex flex-wrap gap-8 items-center justify-center p-4 max-w-screen-xl mx-auto">
      {tag && <HeaderMiddle>By tag: {tag}</HeaderMiddle>}
      {posts && posts.length ? <PostsList posts={posts} /> : <NoPosts />}
      <Link to="/posts/create">Create new post</Link>
    </div>
  );
}
