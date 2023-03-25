import API, { CancellableAxiosPromise } from 'api/request';
import { ReviewCreateFormDataDTO, ReviewFilterDataParams } from 'types/Review';

export const getCreateReviewData = (
  params: ReviewFilterDataParams,
): CancellableAxiosPromise<ReviewCreateFormDataDTO> => {
  return API.get<ReviewCreateFormDataDTO>('/client/review/data', params, {
    authRequired: true,
  });
};
