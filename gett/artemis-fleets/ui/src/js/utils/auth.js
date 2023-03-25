import { get } from 'utils';
const TOKEN_KEY = 'authToken';

export default {
  get isAuthenticated() {
    return !!this.getToken();
  },

  ifAuthenticated(realm, cb) {
    if (!this.isAuthenticated) return this.navigate();

    get('/sessions/current')
      .then((res) => {
        if (res.data.realm === realm) {
          cb();
        } else {
          this.navigate(res.data.realm);
        }
      });
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  accept({ token, realm }) {
    localStorage.setItem(TOKEN_KEY, token);
    this.navigate(realm);
  },

  revoke() {
    localStorage.removeItem(TOKEN_KEY);
    this.navigate();
  },

  navigate(realm) {
    if (realm === 'admin') {
      location.replace('/admin');
    } else if (realm === 'app') {
      location.replace('/');
    } else {
      location.replace('/auth');
    }
  }
};
