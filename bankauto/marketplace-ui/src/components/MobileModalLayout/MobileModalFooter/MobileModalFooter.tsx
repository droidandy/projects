import React, { FC } from 'react';
import { MobileModalContainer } from '../MobileModalContainer/MobileModalContainer';
import { useStyles } from './MobileModalFooter.styles';

interface Props {
  className?: string;
}

export const MobileModalFooter: FC<Props> = ({ children, className }) => {
  const { root } = useStyles();
  return (
    <div className={`${root} ${className}`}>
      <MobileModalContainer>{children}</MobileModalContainer>
    </div>
  );
};
