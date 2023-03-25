import React, { useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { Button, Typography } from '@marketplace/ui-kit';
import { useVehicleReview } from 'store/catalog/review/vehicle';
import { useVehicleItem } from 'store/catalog/vehicle/item';
import { ReviewCard } from 'components/ReviewCard';
import { Pagination } from 'components/Pagination';
import { unauthorizedGuard } from 'guards/unauthorizedGuard';
import { authModalTexts } from 'constants/authModalTexts';
import { AuthSteps, RegistrationTypes } from 'types/Authentication';
import { useStyles } from './Reviews.styles';

export const Reviews = () => {
  const s = useStyles();
  const { reviews, totalPages, currentPage, loading } = useVehicleReview();
  const { vehicle } = useVehicleItem();
  const { push } = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);

  const handlePageChange = useCallback(
    (e, page: number) => {
      push(
        {
          pathname: window.location.pathname,
          query: {
            page,
          },
        },
        undefined,
        {
          scroll: false,
        },
      );
      if (containerRef.current) {
        (containerRef?.current).scrollIntoView({ behavior: 'smooth' });
      }
    },
    [push],
  );

  const handleOpenReviewForm = useCallback(() => {
    const { brand, model, id } = vehicle!;
    const url = `/profile/reviews/create?brandAlias=${brand.alias}&brandId=${brand.id}&modelAlias=${model.alias}&modelId=${model.id}&offerId=${id}`;

    unauthorizedGuard(
      url,
      authModalTexts[AuthSteps.AUTH].title,
      authModalTexts[AuthSteps.AUTH].text,
      RegistrationTypes.REVIEW,
    ).then(() => {
      push(
        `/profile/reviews/create?brandAlias=${brand.alias}&brandId=${brand.id}&modelAlias=${model.alias}&modelId=${model.id}&offerId=${id}`,
      );
    });
  }, [vehicle, push]);

  if (!reviews.length) {
    return (
      <div className={s.emptyReviewListMessage}>
        <Typography align="center">Пока отзывов нет, но вы можете</Typography>
        <Button color="primary" variant="text" onClick={handleOpenReviewForm} className={s.createReviewButton}>
          <Typography color="primary">добавить первый</Typography>
        </Button>
      </div>
    );
  }
  return (
    <div ref={containerRef}>
      {reviews.map((review) => (
        <ReviewCard {...review} />
      ))}
      {totalPages && totalPages > 1 ? (
        <div className={s.pagination}>
          <Pagination
            page={currentPage}
            disabled={loading}
            count={totalPages ? totalPages : undefined}
            onChange={handlePageChange}
          />
        </div>
      ) : null}
    </div>
  );
};
