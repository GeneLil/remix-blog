import { requireAuth } from "~/utils/authGuard.server";
import { ValidatedForm, validationError } from "remix-validated-form";
import { HeaderSmall } from "~/components/Typography";
import { FormInput } from "~/components/FormInput";
import { ImageUploader } from "~/components/ImageUploader";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import {
  redirect,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";
import type { User } from "~/services/user";
import { useUserImage } from "~/context/user";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MAX_IMAGE_SIZE = 5_000_000;

const userProfileValidator = withZod(
  z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email("Email is required"),
    photoLink: z
      .any()
      .refine((file) => !!file, { message: "Image is required." })
      .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), {
        message: ".jpg, .jpeg, .png and .webp files are accepted.",
      })
      .refine((file) => file?.size <= MAX_IMAGE_SIZE, {
        message: `Max file size is 5MB.`,
      }),
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

  const result = await userProfileValidator.validate(formData);

  if (result.error) {
    return validationError(result.error);
  }

  const { firstName, lastName, email, photoLink } = result.data;

  const user = await getUser(request);

  if (!user) {
    throw new Error("Unable to update a user");
  }

  await prisma.profile.upsert({
    create: {
      userId: user.id,
      firstName,
      lastName,
      photoLink: photoLink.name,
    },
    update: {
      firstName,
      lastName,
      photoLink: photoLink.name,
    },
    where: { userId: user.id },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { email },
  });

  return redirect("/posts");
};

export const loader = async ({ request }: { request: Request }) => {
  const { user } = await requireAuth(request);
  return { user };
};

export default function ProfileLayout() {
  const { user } = useLoaderData<{ user: User | null }>();
  const userImage = useUserImage(user?.profile?.photoLink);
  return (
    <div className="w-1/2 flex flex-col gap-4 mx-auto">
      <HeaderSmall className="text-center">Edit user profile</HeaderSmall>
      <ValidatedForm
        id="update-user-form"
        method="POST"
        encType="multipart/form-data"
        validator={userProfileValidator}
        defaultValues={{
          firstName: user?.profile?.firstName,
          lastName: user?.profile?.lastName,
          email: user?.email,
          photoLink: user?.profile?.photoLink,
        }}
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
          <FormInput id="email" label="Email" name="email" type="email" />
        </div>
        <div className="mb-5">
          <ImageUploader
            name="photoLink"
            label="User image"
            defaultImage={userImage}
          />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Update
        </button>
      </ValidatedForm>
    </div>
  );
}
