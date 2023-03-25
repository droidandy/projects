import { Dispatch } from 'redux';
import axios, { AxiosError } from 'axios';
import { User } from '@marketplace/ui-kit/types';
import { getTokenBySmsCode, refreshToken, registerUserByPhone, removeToken } from 'api/auth';
import { getProfile, setEmail, verifyEmail, verifyPhone as verifyPhoneApi } from 'api/profile';
import { AsyncAction } from 'types/AsyncAction';
import { AuthSteps, RegistrationTypes } from 'types/Authentication';
import { Pending } from 'helpers/pendings';
import { authModalTexts } from 'constants/authModalTexts';
import { GTMPageViewWithId } from 'helpers/getPageView';
import { handleLeadSourceCookies } from 'helpers/cookies';
import { clearCookieAuthToken, setCookieAuthToken } from 'helpers/authCookies';
import { analyticsAuthFormRegistrationComplete } from 'helpers/analytics/events';
import { DEFAULT_CITY_ID } from 'constants/defaultCity';
import { actions as userActions } from './reducers';

const handleError = (error: Error | AxiosError) => (dispatch: Dispatch) => {
  if (axios.isCancel(error)) {
    return Promise.reject();
  }

  return dispatch(userActions.setError(error));
};

const fireSyncUserAnalytics =
  (user: User, isFirstLoad?: boolean): AsyncAction =>
  () => {
    if (isFirstLoad) {
      GTMPageViewWithId(window.location.pathname, user.uuid);
    }
    if (user.firstName) {
      handleLeadSourceCookies(user.uuid);
    }
  };

const fireRegistrationCompleteAnalytics =
  (uuid?: string): AsyncAction =>
  (_dispatch, getState) => {
    if (uuid) {
      return analyticsAuthFormRegistrationComplete(uuid);
    }
    const { user } = getState();
    return analyticsAuthFormRegistrationComplete(user.uuid);
  };

const changeAuthModalVisibility =
  (
    authModalOpen: boolean,
    {
      authModalTitle = authModalTexts[AuthSteps.DEFAULT].title,
      authModalText = authModalTexts[AuthSteps.DEFAULT].text,
      additionalButtonText,
      handleOnCloseCallback,
      additionalButtonOnClick,
      regType,
    }: {
      authModalTitle?: string;
      authModalText?: string;
      additionalButtonText?: string;
      handleOnCloseCallback?(isAuthorized: boolean): void;
      additionalButtonOnClick?(): void;
      regType?: RegistrationTypes;
    } = {},
  ): AsyncAction =>
  (dispatch, getState) => {
    if (!authModalOpen) {
      const {
        user: { onCloseCallback, isAuthorized },
      } = getState();
      onCloseCallback?.(Boolean(isAuthorized));
    }
    dispatch(
      userActions.changeAuthModalVisibility({
        authModalOpen,
        options: {
          authModalTitle,
          authModalText,
          additionalButtonText,
          additionalButtonOnClick,
          onCloseCallback: handleOnCloseCallback,
          regType,
        },
      }),
    );
  };

const getUser =
  (isFirstLoad = false): AsyncAction<Promise<User>> =>
  (dispatch) =>
    Pending('get-user', getProfile())
      .then(async ({ data }) => {
        await dispatch(fireSyncUserAnalytics(data, isFirstLoad));
        await dispatch(userActions.fillUser(data));
        return data;
      })
      .catch((err) => {
        dispatch(handleError(err));
        throw err;
      });

// name refreshAction needs to identify action on middleware
const refresh = (isFirstLoad = false): AsyncAction =>
  function refreshAction(dispatch, getState) {
    if (!getState().user.authorizationError) {
      return Pending('refresh-token', refreshToken())
        .then(({ data: { token, expiresIn } }) => {
          setCookieAuthToken(token, expiresIn);
          dispatch(userActions.authorizeUser({ expiresIn }));
          dispatch(getUser(isFirstLoad));
        })
        .catch((err) => {
          if (isFirstLoad) {
            GTMPageViewWithId(window.location.pathname);
          }
          dispatch(handleError(err));
        });
    }

    return dispatch(handleError(new Error('Refresh token failed')));
  };

export const saveUserPhone = (phoneNumber: string): AsyncAction => {
  return (dispatch) => {
    dispatch(userActions.setUserPhone(phoneNumber));
  };
};

const authorize = (token: string, expiresIn: number, impersonalizated?: boolean): AsyncAction<Promise<void>> => {
  return async function (dispatch) {
    await setCookieAuthToken(token, expiresIn);
    await dispatch(userActions.authorizeUser({ expiresIn, impersonalizated }));
    // Не выбрасываем ошбки синхронизации пользователя.
    /* TODO будеться что везде при использовании добавлена обработка ошбок убрать перехват, заменить на return dispatch(getUser()); */
    await dispatch(getUser()).catch((e) => {
      dispatch(handleError(e));
    });
  };
};

const authenticateUser =
  (phone: string, code: string): AsyncAction<Promise<User>> =>
  (dispatch) =>
    Pending('get-token', getTokenBySmsCode(phone, code))
      .then(async ({ data: { token, expiresIn } }) => {
        // TODO убрать дублкат кода после доработки метода "authorize"
        await setCookieAuthToken(token, expiresIn);
        await dispatch(userActions.authorizeUser({ expiresIn }));
        return dispatch(getUser());
      })
      .catch((err) => {
        dispatch(handleError(err));
        throw new Error('Не удалось авторизировать пользователя');
      });

interface ConfirmPhoneValues {
  phone: string;
  code: string;
}

interface RegistrationValues {
  firstName: string;
  email?: string | null;
  regType: RegistrationTypes;
  cityId: number;
}

type AuthenticateValues = ConfirmPhoneValues & Partial<RegistrationValues>;

// Проверяем авторзацию пользователя в параметрах или памяти. Предпочтителен параметр
const applyUser =
  (user?: User): AsyncAction<Promise<User>> =>
  (_dispatch, getState) => {
    return new Promise((resolve, reject) => {
      const currentUser: User = user || getState().user;
      if (!currentUser.uuid.length) {
        reject(new Error('Для продолжения необходимо авторизоваться'));
      }
      resolve(currentUser);
    });
  };

// Установка имени пользователя. Необходимо для большинства действий поользователя
const finishRegistreation =
  (values: RegistrationValues, user?: User): AsyncAction<Promise<User>> =>
  async (dispatch) =>
    dispatch(applyUser(user)).then(async (authUser) => {
      const nextEmail = values.email || authUser.email || '';
      await registerUserByPhone(values.firstName, nextEmail, values.cityId, 0, values.regType).catch((err) => {
        dispatch(handleError(err));
        throw new Error('Не удалось установить имя пользователя');
      });
      const nextUser: User = {
        ...authUser,
        firstName: values.firstName,
        email: nextEmail,
        cityId: values.cityId,
      };
      await dispatch(userActions.fillUser(nextUser));
      if (!authUser.firstName) {
        await dispatch(fireRegistrationCompleteAnalytics(nextUser.uuid));
      }
      return nextUser;
    });

const authenticateAndRegister =
  (values: AuthenticateValues): AsyncAction<Promise<User>> =>
  (dispatch) => {
    // авторизуем или регистрируем номер + фитч юзера
    return dispatch(authenticateUser(values.phone, values.code))
      .then((authUser) => {
        // устанавливаем имя пользователя при наличии
        if (values.firstName) {
          return dispatch(
            finishRegistreation({
              firstName: values.firstName,
              email: values.email,
              regType: values.regType || RegistrationTypes.PLAIN,
              cityId: values.cityId || DEFAULT_CITY_ID,
            }),
          );
        }
        return authUser;
      })
      .catch((err) => {
        throw err;
      });
  };

const verifyPhone =
  (phone: string, code: string, callback?: (error?: Error) => void): AsyncAction =>
  (dispatch) =>
    Pending('verify-phone', verifyPhoneApi(phone, code))
      .then(async ({ data: { token, expiresIn } }) => {
        await dispatch(authorize(token, expiresIn));
        if (callback) {
          callback();
        }
      })
      .catch((err) => {
        dispatch(handleError(err));
        if (callback) {
          callback(new Error(err.response?.data?.message || err.message));
        }
      });

const logout = (): AsyncAction => (dispatch) =>
  Pending('remove-token', removeToken())
    .then(() => {
      dispatch(userActions.setLogout(true));
    })
    .then(() => {
      clearCookieAuthToken();
      dispatch(userActions.unauthorizeUser());
    })
    .catch((err) => {
      dispatch(handleError(err));
    });

const automaticLogout = (): AsyncAction => (dispatch) =>
  Pending('remove-token', removeToken())
    .then(async () => {
      await dispatch(userActions.setLogout(true));
      clearCookieAuthToken();
      await dispatch(userActions.unauthorizeUser());
      dispatch(changeAuthModalVisibility(true));
    })
    .catch((err) => {
      dispatch(handleError(err));
    });

const setEmailAction =
  (email: string): AsyncAction =>
  async (dispatch, getState) => {
    await setEmail(email);

    const { user } = getState();
    dispatch(userActions.fillUser({ ...user, isEmailVerified: false, email }));
  };

const verifyEmailAction =
  (token: string): AsyncAction =>
  async (dispatch, getState) => {
    await verifyEmail(token);

    const { user } = getState();
    dispatch(userActions.fillUser({ ...user, isEmailVerified: true }));
  };

export {
  refresh,
  authenticateUser,
  logout,
  automaticLogout,
  authorize,
  finishRegistreation,
  authenticateAndRegister,
  getUser,
  verifyPhone,
  changeAuthModalVisibility,
  fireRegistrationCompleteAnalytics,
  setEmailAction as setEmail,
  verifyEmailAction as verifyEmail,
};
