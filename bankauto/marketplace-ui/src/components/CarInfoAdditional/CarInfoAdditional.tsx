import React, { FC } from 'react';
import { Typography } from '@marketplace/ui-kit';
import { ReactComponent as EyeIcon } from 'icons/eye.svg';
import { formatFromTimestamp } from 'helpers/formatFromTimestamp';
import { formatNumber } from 'helpers/formatNumber';
import { useStyles } from './CarInfoAdditional.styles';

interface Props {
  date: number;
  totalViews: number;
}

export const CarInfoAdditional: FC<Props> = ({ date, totalViews }) => {
  const classes = useStyles();
  return (
    <Typography component="p" variant="subtitle1" color="textSecondary" className={classes.root}>
      {formatFromTimestamp(date, 'd MMMM')}
      <span className={classes.separator} />
      <EyeIcon className={classes.viewsIcon} />
      {formatNumber(totalViews)}
    </Typography>
  );
};
