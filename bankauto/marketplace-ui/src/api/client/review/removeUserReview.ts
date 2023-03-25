import API, { CancellableAxiosPromise } from 'api/request';

export const removeUserReview = (id: number | string): CancellableAxiosPromise<{ message: string }> => {
  return API.delete<{ message: string }>(`/client/review/${id}`, {}, { authRequired: true });
};
