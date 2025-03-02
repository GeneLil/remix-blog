import { useUser } from "~/context/user";
import _ from "lodash";
import { Form } from "@remix-run/react";
import Logout from "~/routes/logout";

const { upperFirst, lowerCase } = _;

export const UserMenu = () => {
  const user = useUser();

  return (
    <>
      <button
        id="dropdownAvatarNameButton"
        data-dropdown-toggle="dropdownAvatarName"
        className="flex items-center text-sm pe-1 font-medium text-gray-900 rounded-full hover:text-blue-600 dark:hover:text-blue-500 md:me-0 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-white"
        type="button"
      >
        <span className="sr-only">Open user menu</span>
        <img
          className="w-8 h-8 me-2 rounded-full"
          src={`/avatars/${user.profile.photoLink}`}
          alt="user-avatar"
        />
        {user.profile.firstName} {user.profile.lastName}
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>
      <div
        id="dropdownAvatarName"
        className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600"
      >
        <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
          <div className="font-medium">{upperFirst(lowerCase(user.role))}</div>
          <div className="truncate">{user.email}</div>
        </div>
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownInformdropdownAvatarNameButtonationButton"
        >
          <li>
            <a
              href="/profile"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Profile
            </a>
          </li>
        </ul>
        <div className="py-2">
          <Logout />
        </div>
      </div>
    </>
  );
};
