import React, { FC } from 'react';
import { Typography } from '@marketplace/ui-kit';
import { useStyles } from './UserReview.styles';
import { pluralizeReview } from 'constants/pluralizeConstants';

interface Props {
  rating: number;
  reviewCount: number;
}

export const UserReview: FC<Props> = (props) => {
  const { reviewCount, rating } = props;
  const s = useStyles();
  const reviewCountText = pluralizeReview(reviewCount);

  return (
    <div className={s.root}>
      <div className={s.rating}>
        <Typography variant="body2" color="inherit" component="span" className={s.ratingValue}>
          {rating}
        </Typography>
      </div>
      <div className={s.review}>
        <Typography variant="caption" color="textSecondary">
          Пользовательский рейтинг
        </Typography>
        <Typography variant="caption" className={s.reviewCount}>
          {`${reviewCount} ${reviewCountText}`}
        </Typography>
      </div>
    </div>
  );
};
