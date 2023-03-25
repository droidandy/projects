const AUTH_SECRET = 'auth-secret';
const AUTH_TOKEN = 'auth-token';
const USER_PROFILE = 'user-profile';

export function requireAuth(nextState, replace) {
  let access = true;
  if (!loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });

    access = false;
  }

  return access;
}

export function loggedIn() {
  return !!getToken();
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

export function storeToken(token) {
  localStorage.setItem(AUTH_TOKEN, token);
}

export function getToken() {
  return localStorage.getItem(AUTH_TOKEN);
}

export function removeToken() {
  localStorage.removeItem(AUTH_TOKEN);
}

export function storeProfile(profile) {
  localStorage.setItem(USER_PROFILE, JSON.stringify({ email: profile.email, firstName: profile.firstName, lastName: profile.lastName }));

  if (loggedIn()) {
    if (process.env.NODE_ENV === 'production') {
      Promise.all([
        require('@benrevo/benrevo-react-core/dist/vendor/fullstory'), // eslint-disable-line global-require
      ]).then((result) => {
        result[0].default();
      });
    }
  }
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
