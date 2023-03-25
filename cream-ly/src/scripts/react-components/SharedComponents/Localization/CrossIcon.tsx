import * as React from "react";

function CrossIcon({ className }: { className?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M8.5 8.5l16 16m0-16l-16 16" stroke="#66636C" />
    </svg>
  );
}

export default CrossIcon;
