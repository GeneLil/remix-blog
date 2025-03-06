import type { ReactNode } from "react";
import clsx from "clsx";

export const Link = ({ children, to }: { children: ReactNode; to: string }) => (
  <a
    href={to}
    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
  >
    {children}
  </a>
);

export const Error = ({ children }: { children: ReactNode }) => (
  <span className="text-xs text-red-600 dark:text-white">{children}</span>
);

export const Label = ({
  children,
  htmlFor,
  className,
}: {
  children: ReactNode;
  htmlFor: string;
  className?: string;
}) => (
  <label
    htmlFor={htmlFor}
    className={clsx(
      "block mb-2 text-xs font-medium text-gray-900 dark:text-white",
      className,
    )}
  >
    {children}
  </label>
);

export const HeaderSmall = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <span
    className={clsx(
      "block mb-2 text-sm font-medium text-gray-900 dark:text-white",
      className,
    )}
  >
    {children}
  </span>
);

export const HeaderMiddle = ({ children }: { children: ReactNode }) => (
  <h2 className="text-4xl font-extrabold dark:text-white">{children}</h2>
);

export const Paragraph = ({ children }: { children: ReactNode }) => (
  <p className="mb-3 text-gray-500 dark:text-gray-400">{children}</p>
);
