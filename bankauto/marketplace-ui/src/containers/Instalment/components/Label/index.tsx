import React, { FC } from 'react';
import classNames from 'classnames';
import { Grid, Typography } from '@material-ui/core';
import { useStyles } from './Label.styles';

type Props = {
  title: string;
  addition?: string;
};

export const Label: FC<Props> = ({ title, addition }) => {
  const { root, titleWrapper, additionWrapper, item, titleColor } = useStyles();

  return (
    <Grid container wrap="nowrap" justify="flex-start" alignItems="center" className={root}>
      <Grid item className={classNames(titleWrapper, item)}>
        <Typography variant="overline" className={titleColor}>
          {title}
        </Typography>
      </Grid>
      {addition ? (
        <Grid item className={classNames(additionWrapper, item)}>
          <Typography variant="overline" color="primary">
            {addition}
          </Typography>
        </Grid>
      ) : null}
    </Grid>
  );
};
