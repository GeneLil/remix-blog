import Header from "~/components/Header";
import { Outlet } from "@remix-run/react";
import { requireAuth } from "~/utils/authGuard.server";

export const loader = async ({ request }: { request: Request }) => {
  await requireAuth(request);
  return null;
};

export default function PostsLayout() {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
