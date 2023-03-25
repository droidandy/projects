import React, { FC } from 'react';
import { AutocompleteOption } from '../types';
import { useStyles } from './Tags.styles';

interface Props {
  selectedOptions: AutocompleteOption[];
}

export const Tags: FC<Props> = ({ selectedOptions }) => {
  const { root, labelText, suffixBadge } = useStyles();

  if (selectedOptions.length === 0) {
    return null;
  }

  const { label } = selectedOptions[0];
  const suffix = selectedOptions.length > 1 ? `+${selectedOptions.length - 1}` : '';

  return (
    <div className={root}>
      <div className={labelText}>{label}</div>
      {suffix && <div className={suffixBadge}>{suffix}</div>}
    </div>
  );
};
