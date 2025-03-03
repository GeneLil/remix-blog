import { redirect } from "@remix-run/node";
import { sessionStorage } from "~/utils/session.server";
import { Form } from "@remix-run/react";
import { requireAuth } from "~/utils/authGuard.server";

export const loader = async ({ request }: { request: Request }) => {
  await requireAuth(request);
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );

  if (!session.has("userId")) {
    return redirect("/");
  }
  return Response.json(null);
};

export const action = async ({ request }: { request: Request }) => {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );

  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
};

export default function Logout() {
  return (
    <Form method="POST">
      <button
        type="submit"
        className="w-full text-left block px-8 py-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
      >
        Sign out
      </button>
    </Form>
  );
}
