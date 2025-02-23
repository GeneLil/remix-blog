import { prisma } from "~/utils/db.server";
import { Link, useLoaderData } from "@remix-run/react";

type Post = {
  id: string;
  title: string;
  body: string;
  authorId: string;
  photoLink: string;
  tags: string[];
  comments: string[];
  likes: string[];
};

export const loader = async () => {
  try {
    const posts = await prisma.post.findMany();
    return Response.json({ posts });
  } catch (error) {
    return Response.json({
      posts: [],
      error: `Failed to fetch posts. Info: ${error}`,
    });
  }
};

const NoPosts = () => <p className="">There are no posts yet!</p>;

const PostsList = ({ posts }: { posts: Post[] }) =>
  posts.map((post) => <div key={post.id}>{post.id}</div>);

export default function PostsGrid() {
  const { posts, error } = useLoaderData<{ posts: Post[]; error?: string }>();

  return (
    <div className="max-w-screen-xl flex flex-wrap flex-col items-center justify-center mx-auto p-4">
      {posts && posts.length ? <PostsList posts={posts} /> : <NoPosts />}
      {error && <p className="text-red-600">{error}</p>}
      <Link to="/posts/create">Create new post</Link>
    </div>
  );
}
