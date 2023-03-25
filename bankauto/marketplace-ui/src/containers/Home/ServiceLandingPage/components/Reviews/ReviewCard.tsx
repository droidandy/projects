import React from 'react';
import cx from 'classnames';
import { Typography } from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { useBreakpoints } from '@marketplace/ui-kit';
import { formatFromTimestamp } from 'helpers';
import { useStyles } from './ReviewCard.styles';

const format = 'd MMMM yyyy';

interface ReviewCardProps {
  className?: string;
  name?: string;
  auto?: string;
  serviceName?: string;
  dateTime: number;
  rating?: number;
  text: string;
}

export const ReviewCard = React.memo(
  ({ className, name, auto, serviceName, dateTime, rating = 0, text }: ReviewCardProps) => {
    const s = useStyles();
    const { isMobile } = useBreakpoints();
    const commentDate = formatFromTimestamp(dateTime, format);

    const renderCommentDate = () => {
      return (
        dateTime && (
          <Typography variant="body1" component="span">
            {commentDate}
          </Typography>
        )
      );
    };

    return (
      <div className={cx(s.container, className)}>
        <div className={s.header}>
          <div className={s.carServiceInfo}>
            {serviceName && (
              <p className={s.carService}>
                Автосервис
                <span className={s.service}>{serviceName}</span>
              </p>
            )}
            {rating > 0 && <Rating className={s.rating} value={rating} precision={0.5} size="small" readOnly />}
          </div>
          {!isMobile && renderCommentDate()}
        </div>
        <div className={s.content}>
          <div className={s.contentInner}>
            <div className={s.clientInfo}>
              {name && (
                <div className={s.icon}>
                  <span>{name.slice(0, 1).toUpperCase()}</span>
                </div>
              )}
              <div>
                {name && <p className={s.name}>{name}</p>}
                {auto && <p className={s.auto}>{auto}</p>}
              </div>
            </div>
            {isMobile && renderCommentDate()}
          </div>
          {text && <p className={s.comment}>{text}</p>}
        </div>
      </div>
    );
  },
);
