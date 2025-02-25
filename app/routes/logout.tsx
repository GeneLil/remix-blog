import { redirect } from "@remix-run/node";
import { sessionStorage } from "~/utils/session.server";

// Обработчик для GET-запросов
export const loader = async () => {
  return redirect("/"); // Перенаправим пользователя на главную, если он перешел по URL
};

export const action = async ({ request }: { request: Request }) => {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );

  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
};
