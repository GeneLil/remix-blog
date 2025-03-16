import { useUser, useUserImage } from "~/context/user";
import _ from "lodash";
import Logout from "~/routes/logout";
import { Dropdown } from "flowbite-react";

const { upperFirst, lowerCase } = _;

export const UserMenu = () => {
  const user = useUser();
  const userImage = useUserImage(user.profile?.photoLink);

  return (
    <>
      <Dropdown
        label=""
        dismissOnClick={false}
        renderTrigger={() => (
          <div className="flex items-center gap-4 cursor-pointer">
            <span className="sr-only">Open user menu</span>
            <img
              className="w-8 h-8 me-2 rounded-full"
              src={userImage}
              alt="user-avatar"
            />
            {user.profile?.firstName} {user.profile?.lastName}
          </div>
        )}
      >
        <Dropdown.Header>
          <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
            <div className="font-medium">
              {upperFirst(lowerCase(user.role))}
            </div>
            <div className="truncate">{user.email}</div>
          </div>
        </Dropdown.Header>
        <Dropdown.Item>
          <a
            href="/profile"
            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            Profile
          </a>
        </Dropdown.Item>
        <Dropdown.Divider className="h-[1px]" />
        <Logout />
      </Dropdown>
    </>
  );
};
