import { CircularProgress } from '@material-ui/core';
import React from 'react';
import { useStyles } from './LoaderProgress.styles';

export const LoaderProgress = (): JSX.Element => {
  const { root } = useStyles();
  return (
    <div className={root}>
      <CircularProgress />
    </div>
  );
};
