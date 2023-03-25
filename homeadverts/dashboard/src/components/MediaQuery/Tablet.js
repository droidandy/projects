import React from 'react';
import MediaQuery from 'react-responsive';

export default function Tablet(props) {
  return <MediaQuery {...props} maxWidth={1023} />;
}
