import React from 'react';

interface DisplayTransStringProps {
  value: string;
}

export function DisplayTransHtml(props: DisplayTransStringProps) {
  const { value } = props;
  if (!value) {
    return null;
  }
  
  return <div dangerouslySetInnerHTML={{ __html: value }} />;
}
