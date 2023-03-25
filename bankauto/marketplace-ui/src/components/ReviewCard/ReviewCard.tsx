import React, { FC } from 'react';
import cx from 'classnames';
import { Typography } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { useBreakpoints } from '@marketplace/ui-kit';
import { formatFromTimestamp } from 'helpers';
import { Review } from 'types/Review';
import { Photos, ReviewCharacteristics, ReviewText } from './components';
import { useStyles } from './ReviewCard.styles';

const format = 'd MMMM yyyy';

interface Props extends Review {
  className?: string;
}

export const ReviewCard: FC<Props> = ({ className, ...review }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();

  const { author, dateTime, images, rating } = review;

  return (
    <div className={cx(s.rootContainer, className)}>
      <div className={s.header}>
        <div className={s.userInfo}>
          {author && (
            <div className={s.avatar}>
              <span>{author.slice(0, 1).toUpperCase()}</span>
            </div>
          )}
          <div className={s.name}>
            {author && <Typography variant="h5">{author}</Typography>}
            {isMobile && <Typography variant="body1">{formatFromTimestamp(dateTime, format)}</Typography>}
          </div>
        </div>

        <div className={s.additionalInfo}>
          {!isMobile && <Typography variant="body1">{formatFromTimestamp(dateTime, format)}</Typography>}
          <Rating className={s.rating} value={rating} precision={0.1} size="small" readOnly />
        </div>
      </div>

      <div className={s.contentContainer}>
        <Photos images={images} />
        <ReviewCharacteristics characteristics={review} />
        <ReviewText {...review} />
      </div>
    </div>
  );
};
