import React, { FC } from 'react';
import { Box } from '@marketplace/ui-kit';
import { EmptyByParams } from './EmptyByParams';
import { EmptyByCity } from './EmptyByCity';
import { useStyles } from './EmptyMessage.styles';

interface Props {
  isMoscow?: boolean;
}

export const EmptyMessage: FC<Props> = ({ isMoscow }) => {
  const s = useStyles();
  return <Box className={s.root}>{isMoscow ? <EmptyByParams /> : <EmptyByCity />}</Box>;
};
