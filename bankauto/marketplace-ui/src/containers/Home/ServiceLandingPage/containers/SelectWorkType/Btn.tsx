import React from 'react';
import { useStyles } from './Btn.styles';

type ButtonProps = {
  active: boolean;
  label?: string | number;
  onClick?: () => void;
  children?: any;
};

export const Btn = ({ active = false, label, children, ...props }: ButtonProps) => {
  const s = useStyles({ active });
  return (
    <div className={s.container} {...props}>
      <p className={s.label}>{label || children}</p>
    </div>
  );
};
