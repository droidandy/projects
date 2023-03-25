import { Router } from 'express';
import { getBlogCategories } from '../../services/blogCategories';
import { getPosts, getDetailedPost, setPostRating } from '../../services/blogPosts';
import { getBlogHashTags, getBlogHashTag, getBlogPopularHashTags } from '../../services/blogHashtags';

const router = Router();

router.get('/posts', async (req, res, next) => {
  try {
    const params = req.query;
    const { data } = await getPosts(params);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/posts/:slug', async (req, res, next) => {
  const params = req.query;
  const { slug } = req.params;
  try {
    const { data } = await getDetailedPost(slug, params);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/posts/alias/:alias/ratings', async (req, res, next) => {
  const { alias } = req.params;
  const { rating, clientId } = req.body;
  try {
    const { data } = await setPostRating(alias, rating, clientId);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/categories', async (req, res, next) => {
  try {
    const { data } = await getBlogCategories(req.params);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/hashtags', async (req, res, next) => {
  try {
    const { data } = await getBlogHashTags(req.params);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/hashtags/popular', async (req, res, next) => {
  try {
    const { data } = await getBlogPopularHashTags(req.params);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/hashtags/alias/:slug', async (req, res, next) => {
  const { slug } = req.params;
  try {
    const { data } = await getBlogHashTag(slug);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
