import React from 'react';
interface PlusIconProps {
  color?: string;
}
export function PlusIcon(props: PlusIconProps) {
  const { color } = props;
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill={color ? color : 'white'} d="M10.7188 4.84375C10.7891 4.84375 10.8594 4.89062 10.9062 4.9375C10.9531 4.98438 11 5.05469 11 5.125V5.875C11 5.96875 10.9531 6.03906 10.9062 6.08594C10.8594 6.13281 10.7891 6.15625 10.7188 6.15625H6.40625V10.4688C6.40625 10.5625 6.35938 10.6328 6.3125 10.6797C6.26562 10.7266 6.19531 10.75 6.125 10.75H5.375C5.28125 10.75 5.21094 10.7266 5.16406 10.6797C5.11719 10.6328 5.09375 10.5625 5.09375 10.4688V6.15625H0.78125C0.6875 6.15625 0.617188 6.13281 0.570312 6.08594C0.523438 6.03906 0.5 5.96875 0.5 5.875V5.125C0.5 5.05469 0.523438 4.98438 0.570312 4.9375C0.617188 4.89062 0.6875 4.84375 0.78125 4.84375H5.09375V0.53125C5.09375 0.460938 5.11719 0.390625 5.16406 0.34375C5.21094 0.296875 5.28125 0.25 5.375 0.25H6.125C6.19531 0.25 6.26562 0.296875 6.3125 0.34375C6.35938 0.390625 6.40625 0.460938 6.40625 0.53125V4.84375H10.7188Z"/>
    </svg>
  );
}