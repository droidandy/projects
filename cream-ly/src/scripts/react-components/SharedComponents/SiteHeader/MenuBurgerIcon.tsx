import * as React from "react";

interface IPropsIcon {
  className?: string;
  onClick?: (e) => void;
}

function MenuBurgerIcon(props: IPropsIcon) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="21"
      viewBox="0 0 26 21"
      {...props}
    >
      <g fill="none">
        <path fill="#fff" d="M-530.694-1614.6H747.084V521.883H-530.694z" />
        <path
          stroke="#66636C"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={0.979}
          d="M.98 2.448h14.56M.98 10.281h24.44M.98 18.114h17.68"
        />
      </g>
    </svg>
  );
}

export default MenuBurgerIcon;
