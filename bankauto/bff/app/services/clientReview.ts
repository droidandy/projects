import { AxiosResponse } from 'axios';
import API, { DIR_URL } from '../config';
import { AuthHeaders } from '../utils/authHelpers';
import {
  CreateReviewDTO,
  CreateReviewParams,
  CurrentUserReviewDTO,
  CurrentUserReviewsParams,
  EditReviewParams,
  ReviewDTO,
  ReviewFilterParams,
  ReviewStatsDTO,
  ReviewsStatsParams,
  ReviewFilterDataParams,
  ReviewFilterData,
} from '../types/dtos/review.dto';

export const getReviewsByFilter = (
  params: ReviewFilterParams,
  auth: AuthHeaders,
): Promise<AxiosResponse<ReviewDTO[]>> => {
  return API.get<ReviewDTO[]>(
    '/v1/review/list',
    { ...params },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  );
};

export const getUserReviews = (
  params: CurrentUserReviewsParams,
  auth: AuthHeaders,
): Promise<AxiosResponse<CurrentUserReviewDTO[]>> => {
  return API.get<CurrentUserReviewDTO[]>(
    '/v1/client/review/list',
    { ...params },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  );
};

export const getReviewsStats = (
  params: ReviewsStatsParams,
  auth: AuthHeaders,
): Promise<AxiosResponse<ReviewStatsDTO>> => {
  return API.get<ReviewStatsDTO>(
    '/v1/review/stats',
    { ...params },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  );
};

export const createReview = (
  params: CreateReviewParams,
  auth: AuthHeaders,
): Promise<AxiosResponse<CreateReviewDTO>> => {
  return API.post<CreateReviewDTO>(
    '/v1/client/review/add',
    { ...params },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  );
};

export const editReview = (
  { id, ...params }: EditReviewParams,
  auth: AuthHeaders,
): Promise<AxiosResponse<CreateReviewDTO>> => {
  return API.post<CreateReviewDTO>(
    `/v1/client/review/edit?id=${id}`,
    { ...params },
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  );
};

export const removeReview = (id: number | string, auth: AuthHeaders): Promise<AxiosResponse<void>> => {
  return API.delete<void>(
    `/v1/client/review?id=${id}`,
    {},
    {
      headers: auth,
      baseURL: DIR_URL,
    },
  );
};

export const getFilterData = (
  params: ReviewFilterDataParams,
  auth: AuthHeaders,
): Promise<AxiosResponse<ReviewFilterData>> => {
  return API.get<ReviewFilterData>('/v1/review/data', params, {
    headers: auth,
    baseURL: DIR_URL,
  });
};
