import { json, redirect } from "@remix-run/node";
import { Form, useActionData, Link } from "@remix-run/react";
import { prisma } from "~/utils/db.server";
import { verifyPassword } from "~/utils/auth.server";
import { sessionStorage } from "~/utils/session.server";

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await verifyPassword(password, user.password))) {
    return json({ error: "Неверный email или пароль" }, { status: 400 });
  }

  const session = await sessionStorage.getSession();
  session.set("userId", user.id);

  return redirect("/posts", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
};

export default function LoginPage() {
  const actionData = useActionData<{ error?: string }>();

  return (
    <div>
      <h2>Вход в аккаунт</h2>
      <Form method="post">
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Пароль" required />
        <button type="submit">Войти</button>
        {actionData?.error && <p>{actionData.error}</p>}
      </Form>
      <p>
        Нет аккаунта?{" "}
        <Link
          to="/register"
          style={{ color: "blue", textDecoration: "underline" }}
        >
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}
