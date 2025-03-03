import { redirect } from "@remix-run/node";
import { useActionData, Link } from "@remix-run/react";
import { prisma } from "~/utils/db.server";
import { verifyPassword } from "~/utils/auth.server";
import { sessionStorage } from "~/utils/session.server";
import { FormInput } from "~/components/FormInput";
import { ValidatedForm } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { Error, Paragraph, HeaderSmall } from "~/components/Typography";
import { z } from "zod";

const loginValidator = withZod(
  z.object({
    email: z
      .string()
      .min(1, { message: "This field must be filled" })
      .email("Email format not valid"),
    password: z.string().min(1, { message: "Password must be filled" }),
  }),
);

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await verifyPassword(password, user.password))) {
    return Response.json({ error: "Wrong email or password" }, { status: 400 });
  }

  const session = await sessionStorage.getSession();
  session.set(
    "userId",

    user.id,
  );

  return redirect("/posts", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
};

export default function LoginPage() {
  const actionData = useActionData<{ error?: string }>();

  return (
    <div className="mx-auto w-[600px] h-screen flex flex-col gap-6 justify-center items-center ">
      <HeaderSmall>Log into account</HeaderSmall>
      <ValidatedForm
        validator={loginValidator}
        method="post"
        className="w-full"
      >
        <div className="mb-5">
          <FormInput
            label="Email"
            type="email"
            id="email"
            name="email"
            required
          />
        </div>
        <div className="mb-5">
          <FormInput
            id="password"
            label="Password"
            type="password"
            name="password"
            placeholder="Password"
            required
          />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Log in
        </button>
      </ValidatedForm>
      {actionData?.error && <Error>{actionData.error}</Error>}
      <Paragraph>
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          style={{ color: "blue", textDecoration: "underline" }}
        >
          Register
        </Link>
      </Paragraph>
    </div>
  );
}
