import React, { FC } from 'react';
import { Typography } from '@material-ui/core';
import { useStyles } from './SoldOutLabel.styles';

export const SoldOutLabel: FC = () => {
  const { root, item } = useStyles();

  return (
    <div className={root}>
      <Typography variant="overline" component="div" className={item}>
        Продано
      </Typography>
    </div>
  );
};
