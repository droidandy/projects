import Auth0Lock from 'auth0-lock';
import { storeSecret, storeToken } from 'utils/authService/lib';
import { checkRole } from './../../utils/authService/actions';
import { persist } from './../../utils/persistStore';
import { ORIGIN } from '../../components/Window/constants';

import * as Secrets from '../../secrets';

export const LOCK_CONTAINER_ID = 'lock-container';

let lock;

export function createAndShow(nextPathname) {
  lock = createLock(nextPathname);
  lock.on('authenticated', (data) => {
    // checkSecret(secret);
    storeToken(data.idToken, data.accessToken);
    persist.store.dispatch(checkRole(false, nextPathname));
    window.localStorage.removeItem('auth0.ssodata');
  });
  lock.show();
}

function createLock(nextPathname) {
  const secret = createNonce();
  storeSecret(secret);
  return new Auth0Lock(Secrets.AUTH0_CLIENT_ID, Secrets.AUTH0_DOMAIN, {
    configurationBaseUrl: 'https://cdn.auth0.com',
    auth: {
      redirect: false,
      redirectUrl: `${ORIGIN}/login/callback`,
      responseType: 'token',
      params: {
        state: JSON.stringify({
          secret,
          nextPathname,
        }),
        scope: 'openid app_metadata profile',
      },
    },
    container: LOCK_CONTAINER_ID,
    languageDictionary: {
      title: 'Login',
    },
    allowSignUp: false,
    theme: {
      logo: '',
      primaryColor: '#4f78c9',
    },
    additionalSignUpFields: [{
      name: 'company_name',
      placeholder: 'Enter your company name',
      // The following properties are optional
    }, {
      name: 'full_name',
      placeholder: 'Enter your full name',
    }],
    // other options see https://auth0.com/docs/libraries/lock/v10/customization
  });
}

function createNonce() {
  let text = '';
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < randomLength(); i += 1) {
    text += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return text;
}

function randomLength() {
  const minLength = 30;
  const maxLength = 50;
  return Math.floor((Math.random() * maxLength) + minLength);
}
