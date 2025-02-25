import type { ReactNode } from "react";

export const Error = ({ children }: { children: ReactNode }) => {
  return (
    <span className="text-xs text-red-600 dark:text-white">{children}</span>
  );
};

export const Label = ({
  children,
  htmlFor,
}: {
  children: ReactNode;
  htmlFor: string;
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      {children}
    </label>
  );
};

export const HeaderSmall = ({ children }: { children: ReactNode }) => {
  return (
    <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      {children}
    </span>
  );
};
