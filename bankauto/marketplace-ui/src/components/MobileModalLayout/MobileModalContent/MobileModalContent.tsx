import React, { FC } from 'react';
import { useStyles } from './MobileModalContent.styles';

interface Props {
  className?: string;
}

export const MobileModalContent: FC<Props> = ({ children, className }) => {
  const { root } = useStyles();
  return <div className={`${root} ${className}`}>{children}</div>;
};
