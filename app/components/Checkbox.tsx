import clsx from "clsx";

type Props = {
  onChange: () => void;
  checked: boolean;
  name: string;
  id: string;
  label: string;
  value: string;
  className?: {
    input?: string;
    label?: string;
  };
};

export const Checkbox = ({
  checked,
  name,
  id,
  label,
  value,
  className,
  onChange,
}: Props) => {
  return (
    <div className="flex items-center">
      <input
        checked={checked}
        onChange={onChange}
        id={id}
        type="checkbox"
        name={name}
        value={value}
        className={clsx(
          "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600",
          className?.input,
        )}
      />
      <label
        htmlFor={id}
        className={clsx(
          "ms-2 text-sm font-medium text-gray-900 dark:text-gray-300",
          className?.label,
        )}
      >
        {label}
      </label>
    </div>
  );
};
