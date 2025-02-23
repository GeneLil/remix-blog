import { prisma } from "~/utils/db.server";

export const action = async ({ request }: { request: Request }) => {};

export default function CreatePost() {
  return <div>Here you can create a post</div>;
}
