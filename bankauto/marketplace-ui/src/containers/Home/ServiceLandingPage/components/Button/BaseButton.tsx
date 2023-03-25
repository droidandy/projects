import React from 'react';
import { Button } from '@marketplace/ui-kit';
import { ReactComponent as ArrowBack } from 'icons/arrowBack.svg';
import { useStyles } from './BaseButton.style';

type BaseButtonProps = {
  onClick: () => void;
  label: string;
  startIcon?: any;
};

export const BaseButton = React.memo(({ label, ...props }: BaseButtonProps) => {
  const s = useStyles();
  return (
    <Button variant="text" size="large" color="primary" {...props}>
      <span className={s.label}>{label}</span>
    </Button>
  );
});

export const Item = React.memo(({ label, ...props }: BaseButtonProps) => {
  const s = useStyles();
  return (
    <Button variant="text" size="large" {...props}>
      <p className={s.item}>{label}</p>
    </Button>
  );
});

export const BackButton = (props: any) => <BaseButton startIcon={<ArrowBack />} label="Назад" {...props} />;
