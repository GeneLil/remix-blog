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
import { LinksFunction, redirect } from "@remix-run/node";
import { UserProvider } from "~/context/user";
import type { User } from "~/services/user";

import "./tailwind.css";
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

// export const action = async () => {
//   return redirect("/login");
// };

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
        <script src="https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.js"></script>
      </body>
    </html>
  );
}

export default function App() {
  return (
    <div>
      <main>
        <div className="max-w-screen-xl mx-auto">
          <Outlet />
        </div>
      </main>
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
