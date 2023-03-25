import React from 'react';
import { useStyles } from './RButton.styles';

type RButtonProps = {
  active: boolean;
  label?: string | number;
  onClick?: () => void;
  children?: any;
};

export const RButton = ({ active = false, label, children, ...props }: RButtonProps) => {
  const s = useStyles({ active });
  return (
    <div className={s.container} {...props}>
      <p className={s.label}>{label || children}</p>
    </div>
  );
};
