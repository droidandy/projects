import React from 'react';
interface UserManagementIconProps {
  color: string;
}
export function UserManagementIcon(props: UserManagementIconProps) {
  const { color } = props;
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path stroke={color} d="M18 1C20.1217 1 22.1566 1.84285 23.6569 3.34315C25.1571 4.84344 26 6.87827 26 9C26 11.1217 25.1571 13.1566 23.6569 14.6569C22.1566 16.1571 20.1217 17 18 17C15.8783 17 13.8434 16.1571 12.3431 14.6569C10.8429 13.1566 10 11.1217 10 9C10 6.87827 10.8429 4.84344 12.3431 3.34315C13.8434 1.84285 15.8783 1 18 1ZM18 23.5C22.851 23.5 27.1915 24.4844 30.2822 26.0297C33.4324 27.6048 35 29.5963 35 31.5V35H1V31.5C1 29.5963 2.56762 27.6048 5.71784 26.0297C8.8085 24.4844 13.149 23.5 18 23.5Z" fill="white" strokeWidth="2"/>
    </svg>
  );
}