import React from 'react';
import { Typography, useBreakpoints } from '@marketplace/ui-kit';
import { Rating, RatingProps } from '@material-ui/lab';
import { useStyles } from '../ReviewsStatistics.styles';

type StatisticRatingProps = {
  averageRating: number | null;
} & Pick<RatingProps, 'onChange' | 'name'>;

export const StatisticRating = ({ averageRating, onChange, ...ratingProps }: StatisticRatingProps) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();

  const ratingDesc = averageRating ? (
    <Typography variant="h2" component="span">
      {averageRating}/5
    </Typography>
  ) : (
    <Typography variant={isMobile ? 'h6' : 'h5'} component="span">
      Нет оценок
    </Typography>
  );

  return (
    <div className={s.ratingWrapper}>
      <Rating
        value={averageRating}
        precision={1}
        size="large"
        readOnly={!onChange}
        onChange={onChange}
        {...ratingProps}
      />
      {ratingDesc}
    </div>
  );
};
