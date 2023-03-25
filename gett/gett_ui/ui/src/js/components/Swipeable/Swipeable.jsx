import React from 'react';
import ReactSwipeable from 'react-swipeable';

function hideKeyboard() {
  const { activeElement } = document;
  setTimeout(() => activeElement.blur(), 0);
}

export default function Swipeable(props) {
  return <ReactSwipeable onTap={ hideKeyboard } { ...props } />;
}
