import { type MetaFunction } from "@remix-run/node";
import { requireAuth } from "~/utils/authGuard.server";

export const meta: MetaFunction = () => {
  return [
    { title: "My Remix blog", description: "My Remix blog" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request }: { request: Request }) => {
  return await requireAuth(request);
};

export default function _index() {
  return <div />;
}
