import { Request, Response, NextFunction } from 'express';
import { flushAuthTokens } from '../utils/authHelpers';

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subdomainAuth } = req.cookies;

    if (!subdomainAuth) {
      throw new Error('unauthorized');
    } else {
      next();
    }
  } catch (e) {
    flushAuthTokens(res);
    res.status(401).json({ message: e.message });
  }
};
