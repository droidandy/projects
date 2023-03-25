import { get } from 'utils';
const TOKEN_KEY = 'authToken';
const REALM_KEY = 'authRealm';
const TARGET_PATH_KEY = 'targetPath';

export function addTokenRedirectListener() {
  window.addEventListener('storage', (e) => {
    if (e.key === TOKEN_KEY) {
      location.replace('/');
    }
  });
}

function navigateToShortUrl(token) {
  get(`/short_urls/${token}`)
    .then((res) => {
      const { originalUrl } = res.data;

      try {
        location.replace(new URL(originalUrl, location).pathname);
      } catch (_e) {
        // fallback for IE
        location.replace(originalUrl.match(/(?:\/\/[^/]+)?(\/.+)$/)[1]);
      }
    });
}

export default {
  get isAuthenticated() {
    try {
      return !!this.getToken();
    } catch (_e) {
      return false;
    }
  },

  ifNotAuthenticated(cb) {
    if (!this.isAuthenticated) return cb();

    get('/session/realm')
      .then((res) => {
        const userRealm = res.data.realm;

        localStorage.setItem(REALM_KEY, userRealm);
        this.navigate(userRealm, true);
      })
      .catch(() => this.revoke());
  },

  getShortUrlToken(path) {
    const match = path.match(/^\/s\/([^/]+)\/?$/);

    return match && match[1];
  },

  ifAuthenticated(realm, cb) {
    const token = this.getShortUrlToken(location.pathname);

    if (!this.isAuthenticated) {
      if (!location.pathname.startsWith('/auth')) {
        localStorage.setItem(TARGET_PATH_KEY, location.pathname);
      }
      return this.navigate();
    }

    if (token) {
      navigateToShortUrl(token);
    } else {
      get('/session/realm', { target: realm })
        .then((res) => {
          const userRealm = res.data.realm;

          if (userRealm === realm) {
            cb();
          } else {
            localStorage.setItem(REALM_KEY, userRealm);
            this.navigate(userRealm);
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            this.revoke();
          }
        });
    }
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getRealm() {
    return localStorage.getItem(REALM_KEY);
  },

  accept({ token, realm }) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REALM_KEY, realm);

    const targetPath = localStorage.getItem(TARGET_PATH_KEY);
    localStorage.removeItem(TARGET_PATH_KEY);

    if (targetPath) {
      return this.resolvePath(realm, targetPath)
        .then(path => location.replace(path))
        .catch(() => this.navigate(realm));
    }

    this.navigate(realm);
  },

  resolvePath(realm, targetPath) {
    return new Promise((resolve) => {
      const token = this.getShortUrlToken(targetPath);

      if (token) {
        navigateToShortUrl(token);
      } else {
        resolve(targetPath);
      }
    }).then((path) => {
      const matcher = realm === 'app' ? /^\/(?!admin|affiliate)/ : new RegExp(`^/${realm}`);

      if (matcher.test(path)) {
        return path;
      } else {
        throw new Error(`unable to resolve path '${path}'`);
      }
    });
  },

  revoke() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REALM_KEY);
    localStorage.removeItem(TARGET_PATH_KEY);
    this.navigate();
  },

  navigate(realm, wasAuthenticated) {
    location.replace(this.realmToPath(realm, wasAuthenticated));
  },

  realmToPath(realm, wasAuthenticated) {
    switch (realm) {
      case 'app': {
        // if logged-in user follows "Reset Password" link, navigate him
        // to "Change Password" page instead
        if (wasAuthenticated && location.pathname === '/auth/reset') {
          return '/settings/change-password';
        }

        return '/';
      }
      case 'admin': {
        // if logged-in admin follows user's "Reset Password" link,
        // logout him before navigating
        if (location.pathname === '/auth/reset') {
          this.revoke();
          return location.href;
        }
        return `/${realm}`;
      }
      case 'affiliate': return `/${realm}`;
      default: return '/auth';
    }
  },

  alertIfCannotAuthenticate() {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
    } catch (_e) {
      alert('Please disable private browsing to use this application');
    }
  }
};
