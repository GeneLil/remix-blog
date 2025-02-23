import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { hashPassword } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";
import { sessionStorage } from "~/utils/session.server";

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return json({ error: "Заполните все поля" }, { status: 400 });
  }

  if (typeof email !== "string" || typeof password !== "string") {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  const hashedPassword = await hashPassword(password);

  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    const session = await sessionStorage.getSession();
    session.set("userId", user.id);

    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    });
  } catch (error) {
    return json({ error: "Ошибка при регистрации" }, { status: 500 });
  }
};

export default function RegisterPage() {
  const actionData = useActionData<{ error?: string }>();

  return (
    <Form method="post">
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Пароль" required />
      <button type="submit">Зарегистрироваться</button>
      {actionData?.error && <p>{actionData.error}</p>}
    </Form>
  );
}
