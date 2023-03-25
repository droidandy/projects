import jwt from 'jsonwebtoken';
import ApiBase from 'lib/ApiBase';

const loginTokenKey = process.env.REACT_APP_LOGIN_TOKEN_KEY || 'capimpact_accesstoken';

class AuthService extends ApiBase {
  getUser() {
    if (this.isAuthenticated()) {
      let token = this.getToken();
      const decoded = jwt.decode(token);
      return decoded;
    }
    return null;
  }

  isAuthenticated() {
    const token = this.getToken();
    return !!(token && !this.isTokenExpired(token));
  }

  async login(data, context = {}) {
    const response = await this.post('auth/login', data);
    return this.onLogin(response, context);
  }

  onLogin(response, context = {}) {
    const { history, location } = context;
    let { from } = location.state || { from: { pathname: '/' } };
    let token = response.access_token;
    if (token) {
      this.setToken(token);
      history.replace(from);
    }
  }

  logout(context = {}) {
    const { history } = context;
    this.destroyToken();
    history.replace('/login');
  }

  getToken() {
    return localStorage.getItem(loginTokenKey);
  }

  setToken(token) {
    return !this.isTokenExpired(token) && localStorage.setItem(loginTokenKey, token);
  }

  destroyToken() {
    return localStorage.removeItem(loginTokenKey);
  }

  isTokenExpired = token => {
    token = token || this.getToken();
    if (!token) {
      return true;
    }
    const decoded = jwt.decode(token);
    let expiryAt = new Date(decoded.exp * 1000);
    let now = new Date();
    return expiryAt <= now;
    /*
      const exp = new Date(decoded.exp * 1000);
      const expiredAt = exp.setHours(
        exp.getHours() + env.TOKEN_EXPIRATION_INTERVAL,
      );
      const nowInSec = new Date().getTime();
      // Check token if expired
      if (expiredAt < nowInSec) {
        return true;
      }
    */
  };
}

export default new AuthService();
