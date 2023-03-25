import React from 'react';
import { ComponentProps } from '../../../types/ComponentProps';
import { useStyles } from './Tags.styles';

interface Props extends ComponentProps {
  label: string;
  suffix?: string;
}

export const TagsHook = ({ className, label, suffix }: Props) => {
  const { rootHook, labelText, suffixBadge } = useStyles();

  return (
    <div className={[rootHook, className].join(' ')}>
      <div className={labelText}>{label}</div>
      {suffix && <div className={suffixBadge}>{suffix}</div>}
    </div>
  );
};
