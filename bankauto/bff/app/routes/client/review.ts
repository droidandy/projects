import { Router } from 'express';
import { CurrentUserReviewsParams, ReviewFilterParams, ReviewsStatsParams, ReviewStatus } from 'types/dtos/review.dto';
import { getAuthHeaders } from '../../utils/authHelpers';
import {
  createReview,
  editReview,
  getFilterData,
  getReviewsByFilter,
  getReviewsStats,
  getUserReviews,
  removeReview,
} from '../../services/clientReview';

const router = Router();

router.get('/filter', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const params: ReviewFilterParams = {
      id: req.query.id ? Number(req.query.id) : undefined,
      brandId: req.query.brandId ? Number(req.query.brandId) : undefined,
      modelId: req.query.modelId ? Number(req.query.modelId) : undefined,
      status: req.query.status as unknown as ReviewStatus,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      offset: req.query.offset ? Number(req.query.offset) : undefined,
    };
    const { data } = await getReviewsByFilter(params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/mine', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const params = req.query as CurrentUserReviewsParams;
    const { data } = await getUserReviews(params, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/stats', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const params: ReviewsStatsParams = {
      brandId: Number(req.query.brandId),
      modelId: Number(req.query.modelId),
    };
    const { data } = await getReviewsStats(params, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/add', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { data } = await createReview(req.body, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { id } = req.params;
    const { data } = await editReview({ id, ...req.body }, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { id } = req.params;
    const { data } = await removeReview(id, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/data', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { data } = await getFilterData(req.query, auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
