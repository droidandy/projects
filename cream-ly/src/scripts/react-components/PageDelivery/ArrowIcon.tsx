import * as React from "react";

const ArrowIcon = (props) => {
  return (
    <svg
      {...props}
      width="12px"
      height="7px"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.05 6.712l-.022.023-.354-.354-4.528-4.527L.793 1.5 1.5.793l.354.353 4.174 4.175 4.197-4.197.353-.353.708.707-.354.354-4.528 4.527-.353.354z"
        fill="{{settings.color_small_button_text}}"
      />
    </svg>
  );
};

export default ArrowIcon;
