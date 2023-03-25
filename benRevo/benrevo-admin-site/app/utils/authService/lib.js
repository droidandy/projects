const AUTH_SECRET = 'auth-secret';
const AUTH_TOKEN = 'auth-token';

export function requireAuth(nextState, replace) {
  if (!loggedIn()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    });
  }
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
