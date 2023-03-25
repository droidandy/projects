import { Router } from 'express';
import { flushAuthTokens, setAuthTokens, setConfirmationToken, setAccessToken } from '../../utils/authHelpers';
import {
  login as userLogin,
  getAuthSms,
  loginBySms,
  refreshToken,
  loginBySmsCode,
  resendAuthSms,
} from '../../services/auth';
import { checkAuth } from '../../middlewares/auth';

const router = Router();

router.post('/login', async (req, res, next) => {
  try {
    const { username, password, clientId } = req.body;

    const { data } = await userLogin(username, password, clientId);

    const { refresh_token, access_token, expires_in } = data;

    setAuthTokens(res, refresh_token);

    res.json({ token: access_token, expiresIn: expires_in });
  } catch (e) {
    next(e);
  }
});

router.post('/refresh', checkAuth, async (req, res, next) => {
  try {
    const { subdomainAuth } = req.cookies;
    const { clientId } = req.body;

    const { data } = await refreshToken(subdomainAuth, clientId);

    const { refresh_token, access_token, expires_in } = data;

    setAuthTokens(res, refresh_token);

    res.json({ token: access_token, expiresIn: expires_in });
  } catch (e) {
    next(e);
  }
});

/**
 * @TODO: Deprecated, should be removed when fully move to OKP auth
 */
router.post('/phone-login-old', async (req, res, next) => {
  try {
    const { phone, code } = req.body;

    const { data } = await loginBySms(phone, code);

    const { refresh_token, access_token, expires_in } = data;

    setAuthTokens(res, refresh_token);

    res.json({ token: access_token, expiresIn: expires_in });
  } catch (e) {
    next(e);
  }
});

router.post('/send-sms', async (req, res, next) => {
  try {
    const { phone } = req.body;

    const { data } = await getAuthSms(phone);

    const { token } = data;

    setConfirmationToken(res, token);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/resend-sms', async (req, res, next) => {
  try {
    const { confirmation_token } = req.cookies;

    const { data } = await resendAuthSms(confirmation_token);

    const { token } = data;

    setConfirmationToken(res, token);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/phone-login', async (req, res, next) => {
  try {
    const { phone, code, clientId } = req.body;

    const { confirmation_token } = req.cookies;

    const { data } = await loginBySmsCode(phone, code, confirmation_token, clientId);

    const { access_token: accessToken } = data;

    setAccessToken(res, accessToken);

    res.json();
  } catch (e) {
    next(e);
  }
});

router.post('/logout', async (req, res) => {
  flushAuthTokens(res);
  res.send('ok');
});

export default router;
