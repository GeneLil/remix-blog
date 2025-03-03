import {
  Form,
  useLoaderData,
  useNavigation,
  useActionData,
  useFetcher,
} from "@remix-run/react";
import { prisma } from "~/utils/db.server";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { TagComponent } from "~/components/Tag";
import { Error, Label } from "~/components/Typography";
import toast from "react-hot-toast";
import {
  deleteTagAction,
  createTagAction,
  type ActionResponse,
  Tag,
} from "~/services/tag";
import { requireAuth } from "~/utils/authGuard.server";

export const loader = async ({ request }: { request: Request }) => {
  await requireAuth(request);
  const tags = await prisma.tag.findMany();
  return Response.json(tags);
};

export const action = async ({ request }: { request: Request }) => {
  if (request.method === "DELETE") {
    return await deleteTagAction(request);
  }
  return await createTagAction(request);
};

export default function Tags() {
  const tags = useLoaderData<Tag[]>();
  const actionData = useActionData<ActionResponse>();
  const [inputValue, setInputValue] = useState("");
  const navigation = useNavigation();
  const fetcher = useFetcher();

  useEffect(() => {
    if (actionData?.success && !navigation.formAction) {
      setInputValue("");
      toast.success("Tag successfully created");
    }
  }, [actionData?.success, navigation.formAction]);

  const onTagDelete = (id: string) => {
    fetcher.submit({ id }, { method: "DELETE" });
  };

  return (
    <div className="max-w-screen-xl mx-auto w-1/2">
      <Form method="POST" className="w-full">
        <div>
          <Label htmlFor="tag-name">Tag name</Label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            id="tag-name"
            name="tag-name"
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          {actionData?.error && <Error>{actionData?.error}</Error>}
        </div>
        <button
          type="submit"
          disabled={!inputValue}
          className={clsx(
            "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg mt-4 text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
            { "cursor-not-allowed": !inputValue },
            { "bg-blue-700": inputValue },
            { "bg-blue-400": !inputValue },
          )}
        >
          Create
        </button>
      </Form>
      <div className="w-full flex flex-wrap gap-2 mt-8">
        {tags.map((tag) => (
          <TagComponent tag={tag} key={tag.id} onIconClick={onTagDelete} />
        ))}
      </div>
    </div>
  );
}
