import React from 'react';
import MediaQuery from 'react-responsive';

export default function Desktop(props) {
  return <MediaQuery {...props} minWidth={1024} />;
}
