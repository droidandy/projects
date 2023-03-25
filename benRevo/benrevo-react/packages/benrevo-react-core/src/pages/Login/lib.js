import Auth0Lock from 'auth0-lock';
import * as Secrets from '../../secrets';
import { origin } from './../../components/Window/constants';
import { storeSecret, storeToken } from './../../utils/authService/lib';
import { checkRole } from './../../utils/authService/actions';
import { persist } from './../../utils/persistStore';

export const LOCK_CONTAINER_ID = 'lock-container';

let lock;

export function createAndShow(nextPathname, CARRIER, secrets) {
  lock = createLock(nextPathname, CARRIER, secrets);
  lock.on('authenticated', (data) => {
    // checkSecret(secret);
    storeToken(data.idToken, data.accessToken);
    persist.store.dispatch(checkRole(false, nextPathname));
    window.localStorage.removeItem('auth0.ssodata');
  });
  lock.show();
}

export function createLock(nextPathname, CARRIER, secrets = {}) {
  const secret = createNonce();
  const AUTH0_CLIENT_ID = secrets.AUTH0_CLIENT_ID || Secrets.AUTH0_CLIENT_ID;
  const AUTH0_DOMAIN = secrets.AUTH0_DOMAIN || Secrets.AUTH0_DOMAIN;

  storeSecret(secret);
  return new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
    configurationBaseUrl: 'https://cdn.auth0.com',
    // overrides: {
    //   __tenant: 'quoteanthem',
    //   __token_issuer: Secrets.AUTH0_DOMAIN,
    // },
    auth: {
      redirect: false,
      redirectUrl: `${origin(CARRIER || '')}${CARRIER ? '/' : ''}login/callback`,
      responseType: 'token',
      params: {
        state: JSON.stringify({
          secret,
          nextPathname,
        }),
        scope: 'openid app_metadata profile',
      },
      sso: false,
    },
    container: LOCK_CONTAINER_ID,
    languageDictionary: {
      title: 'Login',
      forgotPasswordAction: 'Click here to reset your password',
    },
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

export function createNonce() {
  let text = '';
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < randomLength(); i += 1) {
    text += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return text;
}

export function randomLength() {
  const minLength = 30;
  const maxLength = 50;
  return Math.floor((Math.random() * maxLength) + minLength);
}
