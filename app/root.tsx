import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
  useLoaderData,
} from "@remix-run/react";
import { Toaster } from "react-hot-toast";
import { type LinksFunction, redirect } from "@remix-run/node";
import { UserProvider } from "~/context/user";
import type { User } from "~/services/user";
import "./tailwind.css";
import { sessionStorage } from "~/utils/session.server";
import Header from "~/components/Header";
import { getUser } from "~/utils/auth.server";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const loader = async ({ request }: { request: Request }) => {
  const user = await getUser(request);
  return Response.json({ user });
};

export async function action({ request }: { request: Request }) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );

  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="root">{children}</div>
        <ScrollRestoration />
        <Scripts />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

export default function App() {
  const { user } = useLoaderData<{ user: User | null }>();
  return (
    <div>
      {user ? (
        <UserProvider user={user}>
          <Header />
          <main>
            <Outlet />
          </main>
        </UserProvider>
      ) : (
        <main>
          <Outlet />
        </main>
      )}
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <h2 className="text-red-500">
        Error {error.status}: {error.statusText || error.data}
      </h2>
    );
  }

  return (
    <h2 className="text-red-500">
      Error: {error instanceof Error ? error.message : "Неизвестная ошибка"}
    </h2>
  );
}
