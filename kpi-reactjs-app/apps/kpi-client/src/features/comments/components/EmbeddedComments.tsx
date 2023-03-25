import React from 'react';
import { MainCommentsContent } from './MainCommentsContent';

export interface MainCommentsContentProps {
  setIsExpanded: (isExpanded: boolean) => void;
}

export function EmbeddedComments(props: MainCommentsContentProps) {
  const { setIsExpanded } = props;
  return <MainCommentsContent setIsExpanded={setIsExpanded} />;
}
