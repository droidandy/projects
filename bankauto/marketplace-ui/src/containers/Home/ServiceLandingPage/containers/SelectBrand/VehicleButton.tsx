import React from 'react';
import { useStyles } from './VehicleButton.styles';

type VehicleButtonProps = {
  active: boolean;
  label?: string;
  onClick?: () => void;
  children?: any;
  icon?: any;
};

export const VehicleButton = ({ active = false, label, children, icon: Icon, ...props }: VehicleButtonProps) => {
  const s = useStyles({ active });
  return (
    <div className={s.container} {...props}>
      <span className={s.icon}>
        <Icon color={active ? 'white' : '#8C9091'} />
      </span>
      <p className={s.label}>{label || children}</p>
    </div>
  );
};
