import * as React from "react";

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="21"
      fill="none"
      viewBox="3.714 2.289 16.699 19.549"
      {...props}
    >
      <path
        fill="#66636C"
        fillRule="evenodd"
        d="M5 20a5 5 0 015-5h4a5 5 0 015 5H5zm-1 0a6 6 0 016-6h4a6 6 0 016 6v1H4v-1z"
        clipRule="evenodd"
      ></path>
      <path
        fill="#66636C"
        fillRule="evenodd"
        d="M7.1160000000000005 7.977a4.902 4.902 0 109.804 0 4.902 4.902 0 10-9.804 0zm.98 0a3.922 3.922 0 017.844 0 3.922 3.922 0 01-7.844 0z"
      ></path>
    </svg>
  );
}

export default UserIcon;
