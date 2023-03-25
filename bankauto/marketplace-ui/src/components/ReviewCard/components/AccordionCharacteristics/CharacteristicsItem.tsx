import React, { FC } from 'react';
import { Node } from 'components/ReviewCard/helpers';
import { Typography } from '@marketplace/ui-kit';
import { useStyles } from './ReviewCharacteristics.styles';

interface Props extends Node {}

export const CharacteristicsItem: FC<Props> = ({ label, value }) => {
  const s = useStyles();

  return (
    <div className={s.item}>
      <Typography variant="body1">{`${label}:`}</Typography>
      <Typography variant="subtitle1">{value}</Typography>
    </div>
  );
};
