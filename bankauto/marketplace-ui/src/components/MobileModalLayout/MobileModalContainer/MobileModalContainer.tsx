import React, { FC } from 'react';
import { useStyles } from './MobileModalContainer.styles';

interface Props {
  className?: string;
}

export const MobileModalContainer: FC<Props> = ({ children, className }) => {
  const { root } = useStyles();
  return <div className={`${root} ${className}`}>{children}</div>;
};
