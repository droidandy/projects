import * as React from "react";

interface IPropsIcon {
  className?: string;
  onClick?: (e) => void;
}
function MenuCrossIcon(props: IPropsIcon) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        stroke="#66636C"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={0.966}
        d="M.483.483l15.033 15.033M15.517.483L.483 15.516"
        fill="none"
      />
    </svg>
  );
}

export default MenuCrossIcon;
