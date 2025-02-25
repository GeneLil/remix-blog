import clsx from "clsx";

type Props = {
  id: string;
  name: string;
  className?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
};

export const Textarea = ({
  id,
  name,
  className,
  placeholder,
  required,
  rows = 4,
}: Props) => {
  return (
    <textarea
      id={id}
      rows={rows}
      className={clsx(
        "block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
        className,
      )}
      name={name}
      required={required}
      placeholder={placeholder}
    ></textarea>
  );
};
