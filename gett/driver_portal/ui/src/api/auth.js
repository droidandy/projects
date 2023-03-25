import api from './index'

const TOKEN_KEY = 'authToken'
const ADMIN_TOKEN_KEY = 'adminToken'

export default {

  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  getAdminToken() {
    return localStorage.getItem(ADMIN_TOKEN_KEY) ? localStorage.getItem(ADMIN_TOKEN_KEY) : false
  },

  setToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
      this.ifAuthenticated()
    }
  },

  removeToken() {
    if (localStorage.getItem(ADMIN_TOKEN_KEY)) {
      localStorage.setItem(TOKEN_KEY, localStorage.getItem(ADMIN_TOKEN_KEY))
      localStorage.removeItem(ADMIN_TOKEN_KEY)
      window.location = '/'
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  },

  get isAuthenticated() {
    try {
      return !!this.getToken()
    } catch (e) {
      return false
    }
  },

  ifAuthenticated() {
    api().get('/session')
      .then(res => {
        window.location = '/'
      })
      .catch(error => {
        console.error('not-auth', error)
      })
  }
}
