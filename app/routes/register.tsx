import {
  redirect,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { hashPassword } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";
import { sessionStorage } from "~/utils/session.server";
import { ValidatedForm, validationError } from "remix-validated-form";
import { FormInput } from "~/components/FormInput";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { ImageUploader } from "~/components/ImageUploader";
import { HeaderSmall } from "~/components/Typography";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MAX_IMAGE_SIZE = 5_000_000;

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters!" })
  .max(20, { message: "Password must be maximum 20 characters!" })
  .refine((password) => /[A-Z]/.test(password), {
    message: "Password must contain at least one uppercase letter!",
  })
  .refine((password) => /[a-z]/.test(password), {
    message: "Password must contain at least one lowercase letter!",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "Password must contain at least one number!",
  })
  .refine((password) => /[!@#$%^&*_]/.test(password), {
    message: "Password must contain at least one special character!",
  });

const registerValidator = withZod(
  z
    .object({
      firstName: z.string().min(1, { message: "First name is required" }),
      lastName: z.string().min(1, { message: "Last name is required" }),
      email: z
        .string()
        .min(1, { message: "This field must be filled" })
        .email("Email format not valid"),
      password: passwordSchema,
      passwordConfirmation: z
        .string()
        .min(1, { message: "Please confirm your password" }),
      photoLink: z
        .any()
        .refine((file) => !!file, { message: "Image is required." })
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), {
          message: ".jpg, .jpeg, .png and .webp files are accepted.",
        })
        .refine((file) => file?.size <= MAX_IMAGE_SIZE, {
          message: `Max file size is 5MB.`,
        }),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Passwords must match!",
      path: ["passwordConfirmation"],
    }),
);

export const action = async ({ request }: { request: Request }) => {
  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: MAX_IMAGE_SIZE,
      file: ({ filename }) => {
        const extname = filename.split(".").pop();
        return `${Date.now()}.${extname}`;
      },
      directory: "./public/avatars",
    }),
    unstable_createMemoryUploadHandler(),
  );

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler,
  );

  const result = await registerValidator.validate(formData);

  if (result.error) {
    return validationError(result.error);
  }

  const { firstName, lastName, email, photoLink, password } = result.data;

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  await prisma.profile.create({
    data: { firstName, lastName, photoLink: photoLink.name, userId: user.id },
  });

  const session = await sessionStorage.getSession();
  session.set("userId", user.id);

  return redirect("/posts", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
};

export default function RegisterPage() {
  return (
    <div className="mx-auto w-[600px] h-screen flex flex-col gap-6 justify-center items-center ">
      <HeaderSmall>Register new author</HeaderSmall>
      <ValidatedForm
        validator={registerValidator}
        method="POST"
        encType="multipart/form-data"
      >
        <div className="mb-5">
          <FormInput
            id="firstName"
            label="First name"
            name="firstName"
            type="text"
          />
        </div>
        <div className="mb-5">
          <FormInput
            id="lastName"
            label="Last name"
            name="lastName"
            type="text"
          />
        </div>
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
        <div className="mb-5">
          <FormInput
            id="passwordConfirmation"
            label="Password confirmation"
            type="password"
            name="passwordConfirmation"
            placeholder="Password confirmation"
            required
          />
        </div>
        <div className="mb-5">
          <ImageUploader name="photoLink" label="User image" defaultImage="" />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Register
        </button>
      </ValidatedForm>
    </div>
  );
}
