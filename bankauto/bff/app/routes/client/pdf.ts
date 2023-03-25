import { Router } from 'express';
import { createContractPdf } from '../../services/clientContractPdf';

const router = Router();

router.post('/create/contract', async (req, res, next) => {
  try {
    const params = req.body;
    const { data } = await createContractPdf(params);

    res.send(data);
  } catch (e) {
    next(e);
  }
});

export default router;
