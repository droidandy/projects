import { Router } from 'express';
import { addToFavourites, getFavourites, removeFromFavourites } from '../../services/favourites';
import { getAuthHeaders } from '../../utils/authHelpers';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { data } = await getFavourites(auth);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { body } = req;
    const { data } = await addToFavourites(auth, body);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.delete('/', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { body } = req;
    const { data } = await removeFromFavourites(auth, body);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
