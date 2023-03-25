import React from "react";

const InstagramIcon = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 26 26"
    {...props}
  >
    <path
      stroke={props.color}
      strokeWidth={1.5}
      d="M18.704 25.226H7.296a6.524 6.524 0 01-6.522-6.522V7.296A6.524 6.524 0 017.296.774h11.408a6.524 6.524 0 016.522 6.522v11.408a6.524 6.524 0 01-6.522 6.522z"
      clipRule="evenodd"
    />
    <path
      stroke={props.color}
      strokeWidth={1.5}
      d="M19.113 13.611a6.113 6.113 0 11-12.227 0 6.113 6.113 0 0112.227 0z"
      clipRule="evenodd"
    />
    <path
      fill={props.color}
      fillRule="evenodd"
      d="M21.558 5.358a1.529 1.529 0 11-3.057 0 1.529 1.529 0 013.057 0z"
      clipRule="evenodd"
    />
  </svg>
);

InstagramIcon.defaultProps = {
  color: "#fb6ea4"
};

export default InstagramIcon;
