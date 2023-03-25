import { persist } from '../persistStore';
import { ROLE_IMPLEMENTATION_MANAGER } from '../authService/constants';

const AUTH_SECRET = 'auth-secret';
const AUTH_TOKEN = 'auth-token';
const ACCESS_TOKEN = 'access-token';
const USER_PROFILE = 'user-profile';

export function requireAuth(nextState, replace, skipProfile) {
  const roles = persist.store.getState().get('profile').get('brokerageRole').toJS();
  const hasImpManRole = getRole(roles, [ROLE_IMPLEMENTATION_MANAGER]);
  let pathname = nextState.location.pathname;
  if (!nextState.location.basename) {
    // if no base such as /uhc/, the pathname will have a '/' in front
    // this will remove that
    pathname = pathname.slice(1);
  }
  if (!loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: pathname },
    });
  } else if (hasImpManRole && pathname !== 'clients' && pathname !== 'profile' && pathname.indexOf('timeline') !== 0) {
    replace({
      pathname: '/clients',
    });
  } else if (pathname !== 'profile' && !skipProfile) requireUserMetadata(nextState, replace);
}

export function requireUserMetadata(nextState, replace) {
  if (loggedIn()) {
    const profile = getProfile();
    if (!profile || !profile.firstName || !profile.lastName) {
      replace({
        pathname: '/profile',
        state: { nextPathname: nextState.location.pathname },
      });
    }
  }
}

export function loggedIn() {
  return !!getToken() && !!getProfile();
}

export function loggedOut() {
  return !getSecret() && !loggedIn();
}

export function storeSecret(secret) {
  sessionStorage.setItem(AUTH_SECRET, secret);
}

function getSecret() {
  return sessionStorage.getItem(AUTH_SECRET);
}

export function popSecret() {
  const secret = getSecret();
  removeSecret();
  return secret;
}

export function removeSecret() {
  sessionStorage.removeItem(AUTH_SECRET);
}

export function storeToken(token, accessToken) {
  localStorage.setItem(AUTH_TOKEN, token);
  if (accessToken) localStorage.setItem(ACCESS_TOKEN, accessToken);
}

export function getToken() {
  return localStorage.getItem(AUTH_TOKEN);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN);
}

export function storeProfile(profile, withoutVendor) {
  if (!withoutVendor) {
    Promise.all([
      require('../../vendor/zopim'), // eslint-disable-line global-require
    ]);

    if (process.env.NODE_ENV === 'production') {
      Promise.all([
        require('../../vendor/fullstory'), // eslint-disable-line global-require
      ]).then((result) => {
        result[0].default();
      });
    }
  }

  localStorage.setItem(USER_PROFILE, JSON.stringify({ email: profile.email, firstName: profile.firstName, lastName: profile.lastName, brokerName: profile.brokerName }));
}

export function getProfile() {
  return JSON.parse(localStorage.getItem(USER_PROFILE));
}

export function removeToken() {
  localStorage.removeItem(AUTH_TOKEN);
  if (getAccessToken()) localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(USER_PROFILE);
  localStorage.removeItem('auth0.ssodata');
}

export function getRole(profile, checkRoles) {
  const check = (value) => {
    for (let i = 0; i < checkRoles.length; i += 1) {
      if (checkRoles[i] === value) return true;
    }

    return false;
  };
  let allow = !profile.message;
  const roles = (allow && profile.roles) ? profile.roles : profile;

  if (allow && typeof roles === 'object') {
    allow = false;
    for (let i = 0; i < roles.length; i += 1) {
      const role = roles[i];

      if (check(role)) {
        allow = role;
        break;
      }
    }
  } else if (allow && typeof roles === 'string') {
    if (check(roles)) {
      allow = roles;
    } else allow = false;
  }

  return allow;
}
