import type { Tag } from "~/services/tag";

const coloredTags = {
  default: "bg-blue-100 text-blue-800  dark:text-blue-400  border-blue-400",
  dark: "bg-gray-100 text-gray-800  dark:text-gray-400  border-gray-500",
  red: "bg-red-100 text-red-800  dark:text-red-400 border-red-400",
  green: "bg-green-100 text-green-800  dark:text-green-400 border-green-400",
  yellow:
    "bg-yellow-100 text-yellow-800  dark:text-yellow-400 border-yellow-400",
  indigo:
    "bg-indigo-100 text-indigo-800  dark:text-indigo-400  border-indigo-400",
  purple:
    "bg-purple-100 text-purple-800  dark:text-purple-400 border-purple-400",
  pink: "bg-pink-100 text-pink-800  dark:text-pink-400 border-pink-400",
};

const coloredButtons = {
  default:
    "text-blue-400 hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300",
  dark: "text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-gray-300",
  red: "text-red-400 hover:bg-red-200 hover:text-red-900 dark:hover:bg-red-800 dark:hover:text-red-300",
  green:
    "text-green-400 hover:bg-green-200 hover:text-green-900 dark:hover:bg-green-800 dark:hover:text-green-300",
  yellow:
    "text-yellow-400 hover:bg-yellow-200 hover:text-yellow-900 dark:hover:bg-yellow-800 dark:hover:text-yellow-300",
  indigo:
    "text-indigo-400 hover:bg-indigo-200 hover:text-indigo-900 dark:hover:bg-indigo-800 dark:hover:text-indigo-300",
  purple:
    "text-purple-400 hover:bg-purple-200 hover:text-purple-900 dark:hover:bg-purple-800 dark:hover:text-purple-300",
  pink: "text-pink-400 hover:bg-pink-200 hover:text-pink-900 dark:hover:bg-pink-800 dark:hover:text-pink-300",
};

const getColor = (id: string, colorObj: object) => {
  const colors = Object.values(colorObj);
  const hash = id.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return colors[Math.abs(hash) % colors.length];
};

export const TagComponent = ({
  tag,
  onIconClick,
}: {
  tag: Tag;
  onIconClick?: (id: string) => void;
}) => {
  return (
    <span
      key={tag.id}
      className={`text-xs font-medium px-2.5 py-0.5 rounded-sm dark:bg-gray-700 border ${getColor(tag.id, coloredTags)}`}
    >
      {tag.name}
      {onIconClick && (
        <button
          type="button"
          className={`inline-flex items-center p-1 ms-2 text-sm bg-transparent rounded-xs ${getColor(tag.id, coloredButtons)}`}
          data-dismiss-target="#badge-dismiss"
          aria-label="Remove"
          onClick={() => onIconClick(tag.id)}
        >
          <svg
            className="w-2 h-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Remove badge</span>
        </button>
      )}
    </span>
  );
};
