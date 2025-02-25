import { prisma } from "~/utils/db.server";
import { Link, useLoaderData } from "@remix-run/react";
import { Card } from "~/components/Card";
import { TagComponent } from "~/components/Tag";
import type { Tag } from "~/services/tag";

type PostResponse = {
  id: string;
  title: string;
  body: string;
  authorId: string;
  photoLink: string;
  tags: Tag[];
  comments: string[];
  likes: string[];
};

export const loader = async () => {
  try {
    const posts = await prisma.post.findMany({ include: { tags: true } });
    return Response.json({ posts });
  } catch (error) {
    return Response.json({
      posts: [],
      error: `Failed to fetch posts. Info: ${error}`,
    });
  }
};

const NoPosts = () => <p className="">There are no posts yet!</p>;

const PostsList = ({ posts }: { posts: PostResponse[] }) => {
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
    posts: PostResponse[];
    error?: string;
  }>();

  return (
    <div className="max-w-screen-xl flex flex-wrap flex-col items-center justify-center mx-auto p-4">
      {posts && posts.length ? <PostsList posts={posts} /> : <NoPosts />}
      {error && <p className="text-red-600">{error}</p>}
      <Link to="/posts/create">Create new post</Link>
    </div>
  );
}
