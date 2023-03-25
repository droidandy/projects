import React, { FC } from 'react';
import { Typography } from '@marketplace/ui-kit';
import { Link } from 'components/Link'; //TODO: заменить в модуле
import { useStyles } from './EmptyLIst.styles';

export const EmptyLIst: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="subtitle1" align="center">
        У вас ещё нет ни одной заявки на осмотр.
      </Typography>
      <Link href={'/car/'}>
        <Typography variant="subtitle1" color="primary">
          Перейти в каталог
        </Typography>
      </Link>
    </div>
  );
};
