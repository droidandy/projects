import React, { FC, useCallback } from 'react';
import { Button, Typography } from '@marketplace/ui-kit';
import { RatingsCount } from 'types/Review';
import { useVehicleReview } from 'store/catalog/review/vehicle';
import { useRouter } from 'next/router';
import { useVehicleItem } from 'store/catalog/vehicle/item';
import { StatisticRating } from './components/StatisticRating';
import { useStyles } from './ReviewsStatistics.styles';
import { ReviewStatisticListItem } from './components';
import { getReviewsMap } from './helpers';
import { unauthorizedGuard } from '../../guards';
import { authModalTexts } from '../../constants/authModalTexts';
import { AuthSteps, RegistrationTypes } from '../../types/Authentication';

export const ReviewsStatistics: FC = () => {
  const s = useStyles();
  const { stats } = useVehicleReview();
  const { vehicle } = useVehicleItem();

  const getReviewStatisticList = useCallback(
    (ratingsCount: RatingsCount) => {
      const reviewsData = getReviewsMap(ratingsCount);
      return (
        <div className={s.reviewStatisticListWrapper}>
          {reviewsData.map((item) => (
            <ReviewStatisticListItem {...item} />
          ))}
        </div>
      );
    },
    [s],
  );

  const router = useRouter();
  const handleOpenReviewCreateForm = useCallback(() => {
    if (vehicle) {
      const { brand, model } = vehicle!;
      const url = `/profile/reviews/create?brandAlias=${brand.alias}&brandId=${brand.id}&modelAlias=${model.alias}&modelId=${model.id}&offerId=${vehicle.id}`;

      unauthorizedGuard(
        url,
        authModalTexts[AuthSteps.AUTH].title,
        authModalTexts[AuthSteps.AUTH].text,
        RegistrationTypes.REVIEW,
      ).then(() => {
        router.push(url);
      });
    }
  }, [router, vehicle]);

  return (
    <div className={s.root}>
      {stats && (
        <div className={s.statisticsContainer}>
          <StatisticRating averageRating={stats.averageRating} />
          {Object.values(stats.ratingsCount).some((rating) => rating)
            ? getReviewStatisticList(stats.ratingsCount)
            : null}
        </div>
      )}

      <Button variant="contained" color="primary" size="large" fullWidth onClick={handleOpenReviewCreateForm}>
        <Typography variant="h5" component="span">
          Добавить отзыв
        </Typography>
      </Button>
    </div>
  );
};
