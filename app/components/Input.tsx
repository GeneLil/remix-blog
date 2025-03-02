import clsx from "clsx";

type Props = {
  type: string;
  id: string;
  name: string;
  className?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
};

export const Input = ({
  type,
  id,
  className,
  placeholder,
  required,
  name,
  defaultValue,
}: Props) => {
  return (
    <input
      type={type}
      id={id}
      name={name}
      className={clsx(
        "shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light",
        className,
      )}
      placeholder={placeholder}
      required={required}
      defaultValue={defaultValue}
    />
  );
};
