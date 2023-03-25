import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getUser,
  getUsers,
  changePassword,
  verifyEmail,
  verifyPhone,
  passwordResetByEmail,
  passwordResetByPhone,
  requestPasswordReset,
  registerUser,
  quickRegister,
  requestVerifyEmail,
  checkPasswordResetPhoneCode,
  sendVerifyPhoneCode,
  registerUserByPhone,
  updateLeadSource,
  checkIsRegisteredUser,
  setEmail,
  validateResetTokenByEmail,
} from '../../services/user';
import { getAuthHeaders, setAuthTokens } from '../../utils/authHelpers';

const router = Router();

router.get('/profile', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { data } = await getProfile(auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/profile', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const params = req.body;
    const { data } = await updateProfile(params, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/list', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { data } = await getUsers(req.query, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get('/item/:id', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { id } = req.params;
    const { data } = await getUser(id, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/registration', async (req, res, next) => {
  try {
    const { name, phone, password, passwordConfirm, clientId } = req.body;

    await registerUser(name, phone, password, passwordConfirm, clientId);

    res.send('ok');
  } catch (e) {
    next(e);
  }
});

router.post('/registration/check-register-user', async (req, res, next) => {
  try {
    const { firstName, lastName, patronymic, phone, email, regType, meta } = req.body;
    const { data } = await checkIsRegisteredUser(firstName, phone, lastName, patronymic, email, regType, meta);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/registration/phone', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { name, email, cityId, meta, regType, consentTo } = req.body;

    const { data } = await registerUserByPhone(name, email, auth, regType, cityId, consentTo, meta);

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/registration/quick', async (req, res, next) => {
  try {
    const { firstName, phone, lastName, middleName, clientId, meta } = req.body;

    await quickRegister(firstName, phone, lastName, middleName, clientId, meta);

    res.send('ok');
  } catch (e) {
    next(e);
  }
});

router.post('/request-reset/any', async (req, res, next) => {
  try {
    const { email, phone } = req.body;

    await requestPasswordReset(email, phone);

    res.send('ok');
  } catch (e) {
    next(e);
  }
});

router.post('/password-reset/email', async (req, res, next) => {
  try {
    const { token, password, passwordConfirm } = req.body;
    const { data } = await passwordResetByEmail(token, password, passwordConfirm);
    const { refresh_token, access_token, expires_in } = data;
    setAuthTokens(res, refresh_token);
    res.json({ token: access_token, expiresIn: expires_in });
  } catch (e) {
    next(e);
  }
});

router.post('/password-reset/phone', async (req, res, next) => {
  try {
    const { phone, code, password, passwordConfirm } = req.body;

    await passwordResetByPhone(phone, code, password, passwordConfirm);

    res.send('ok');
  } catch (e) {
    next(e);
  }
});

router.post('/email/validate-token', async (req, res, next) => {
  try {
    const { token } = req.body;
    await validateResetTokenByEmail(token);
    res.send('ok');
  } catch (e) {
    next(e);
  }
});

router.post('/password-reset/phone-check-code', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const params = req.body;
    const { data } = await checkPasswordResetPhoneCode(params, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/password/change', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const params = req.body;
    const { data } = await changePassword(params, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/verify/email', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const params = req.body;
    const { data } = await verifyEmail(params, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/verify/phone/code', async (req, res, next) => {
  try {
    const params = req.body;
    await sendVerifyPhoneCode(params);

    res.json({ OK: true });
  } catch (e) {
    next(e);
  }
});

router.post('/verify/phone', async (req, res, next) => {
  try {
    const params = req.body;
    const { data } = await verifyPhone(params);

    const { refresh_token, access_token, expires_in } = data;

    setAuthTokens(res, refresh_token);

    res.json({ token: access_token, expiresIn: expires_in });
  } catch (e) {
    next(e);
  }
});

router.post('/email/request-confirm', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { data } = await requestVerifyEmail(auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.post('/lead-source/update', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const {
      utmSource: utm_source,
      utmContent: utm_content,
      utmMedium: utm_medium,
      utmCampaign: utm_campaign,
      utmTerm: utm_term,
      timestamp,
      userId: user_uuid,
      clientId: client_id,
    } = req.body;

    const { data } = await updateLeadSource(
      {
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content,
        client_id,
        timestamp,
        user_uuid,
      },
      auth,
    );

    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.put('/email/change', async (req, res, next) => {
  try {
    const auth = getAuthHeaders(req);
    const { data } = await setEmail(req.body, auth);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
