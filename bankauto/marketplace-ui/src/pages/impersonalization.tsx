import React, { FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { authorize, logout } from 'store/user';
import { setCookieImpersonalization } from 'helpers/authCookies';

// impersonalization skips refresh user token with (store/user/middlewares).impersonalisationSkipAuthRefresh
const Impersonalization: FC = () => {
  const dispatch = useDispatch();
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    query: { token = '', expires_in = '', redirect_url = '' },
    replace,
  } = useRouter();

  useEffect(() => {
    async function authUser() {
      if (!token || !expires_in || !redirect_url) {
        return;
      }
      setCookieImpersonalization();
      await dispatch(logout());
      await dispatch(authorize(token as string, +expires_in, true));
      replace(redirect_url as string);
    }

    authUser();
  }, [token, expires_in, redirect_url, dispatch, replace]);

  return <>Перенаправление...</>;
};

export default Impersonalization;
