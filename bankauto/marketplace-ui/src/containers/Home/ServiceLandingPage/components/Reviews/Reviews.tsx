import React, { FC, memo } from 'react';
import cx from 'classnames';
import { Typography } from '@material-ui/core';
import { ReviewCard } from './ReviewCard';
import { useStyles } from './Reviews.styles';
import { Props } from './types';

const ReviewsRoot: FC<Props> = (props) => {
  const { titleTypographyProps, classNames, reviews } = props;
  const s = useStyles();
  const hasReviews = reviews.length !== 0;

  return hasReviews ? (
    <>
      <Typography align="left" variant="h4" className={cx(s.title, classNames?.title)} {...titleTypographyProps}>
        Отзывы
      </Typography>
      {reviews.map((review: any) => (
        <ReviewCard
          serviceName={review?.service?.name}
          name={review?.customer_name}
          auto={review?.customer_auto}
          rating={review?.service?.service_classification?.stars}
          dateTime={review?.create_time}
          text={review?.text}
        />
      ))}
    </>
  ) : null;
};

const Reviews = memo(ReviewsRoot);

export { Reviews };
