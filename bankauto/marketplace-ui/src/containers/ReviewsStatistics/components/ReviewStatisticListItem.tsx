import React, { FC } from 'react';
import { Typography } from '@marketplace/ui-kit';
import { pluralize } from 'helpers';
import { useStyles } from '../ReviewsStatistics.styles';

export interface ReviewStatisticListItemType {
  starsCount: number;
  rewiewsCount: number;
  percent: string;
}

const WORDS = ['звезда', 'звезды', 'звезд'];

export const ReviewStatisticListItem: FC<ReviewStatisticListItemType> = ({ starsCount, rewiewsCount, percent }) => {
  const s = useStyles();
  return (
    <div className={s.reviewStatistic}>
      <div className={s.reviewStatisticDesc}>
        <Typography variant="subtitle1" component="span">
          {starsCount} {pluralize(starsCount, WORDS)}
        </Typography>
        <Typography variant="subtitle1" color="primary" component="span">
          {rewiewsCount}
        </Typography>
      </div>
      <div className={s.progressBar}>
        <div className={s.progressStatus} style={{ width: percent }}></div>
      </div>
    </div>
  );
};
