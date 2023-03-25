import { getCookieImpersonalization } from 'helpers/authCookies';
import router from 'next/router';
import { AnyAction } from 'redux';

import { getStore } from 'store';
import { changeAuthModalVisibility, actions as userActions } from 'store/user';
import { RegistrationTypes } from 'types/Authentication';

function unauthorizedGuard(
  b?: string,
  authModalTitle?: string,
  authModalText?: string,
  regType?: RegistrationTypes,
): Promise<void> {
  const { user } = getStore().getState();
  const store = getStore();

  return new Promise((resolve, reject) => {
    if (!(user.isAuthorized && (user.firstName || getCookieImpersonalization()))) {
      if (!b) {
        router.push('/auth/login');
        userActions.setLogout(false);
      } else {
        store.dispatch(
          changeAuthModalVisibility(true, {
            authModalTitle,
            authModalText,
            regType,
          }) as unknown as AnyAction,
        );
      }
      store.dispatch(userActions.setOnAuthRedirect(b || router.asPath));
      reject();
    } else {
      resolve();
    }
  });
}

export { unauthorizedGuard };
