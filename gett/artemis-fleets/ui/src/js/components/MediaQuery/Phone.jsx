import React from 'react';
import MediaQuery from 'react-responsive';

export default function Phone(props) {
  return <MediaQuery { ...props } maxWidth={ 480 } />;
}
