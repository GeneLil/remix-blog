import { MetaFunction, redirect } from "@remix-run/node";
import { requireAuth } from "~/utils/authGuard.server";

export const meta: MetaFunction = () => {
  return [
    { title: "My Remix blog", description: "My Remix blog" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request }: { request: Request }) => {
  await requireAuth(request);
  return redirect("/posts");
};

export default function _index() {
  return <div className="flex h-screen items-center justify-center" />;
}
