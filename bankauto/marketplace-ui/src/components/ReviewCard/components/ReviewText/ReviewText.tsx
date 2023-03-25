import React from 'react';
import { Typography } from '@material-ui/core';
import Icon from '@marketplace/ui-kit/components/Icon';
import { ReactComponent as AdvantagesIcon } from 'icons/advantagesIcon.svg';
import { ReactComponent as DrawbacksIcon } from 'icons/drawbacksIcon.svg';
import { useStyles } from './ReviewText.styles';
import { Review } from 'types/Review';

type ReviewTextProps = Pick<Review, 'text' | 'advantages' | 'drawbacks'>;

export const ReviewText = ({ text, advantages, drawbacks }: ReviewTextProps) => {
  const s = useStyles();

  return (
    <div>
      <Typography className={s.descriptionTitle} variant="h5">
        Описание
      </Typography>

      <Typography variant="body1">{text}</Typography>

      <div className={s.featuresContainer}>
        {advantages && (
          <div>
            <div className={s.featureTitle}>
              <Icon style={{ marginTop: '0.25rem' }} component={AdvantagesIcon} />
              <Typography variant="caption" style={{ fontWeight: 700, paddingLeft: '0.5rem' }}>
                Преимущества
              </Typography>
            </div>
            <div className={s.featureContent}>
              <Typography>{advantages}</Typography>
            </div>
          </div>
        )}

        {drawbacks && (
          <div>
            <div className={s.featureTitle}>
              <Icon style={{ marginTop: '0.25rem' }} component={DrawbacksIcon} />
              <Typography variant="caption" style={{ fontWeight: 700, paddingLeft: '0.5rem' }}>
                Недостатки
              </Typography>
            </div>
            <div className={s.featureContent}>
              <Typography>{drawbacks}</Typography>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
