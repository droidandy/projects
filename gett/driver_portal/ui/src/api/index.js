import Axios from 'axios'
import { camelizeKeys, decamelizeKeys } from 'humps'
import isPlainObject from 'lodash/isPlainObject'
import queryString from 'query-string'

import { default as auth } from './auth'

const baseURL = process.env.REACT_APP_API_BASE_URL

const config = {
  baseURL: baseURL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  responseType: 'json',
  paramsSerializer: (params) => {
    return queryString.stringify(decamelizeKeys(params))
  },
  transformRequest: (data) => {
    if (isPlainObject(data)) {
      return JSON.stringify(decamelizeKeys(data))
    }
    return data
  },
  transformResponse(data) {
    // data comes as string in IE
    if (typeof data === 'string' && data.length) {
      data = JSON.parse(data)
    }
    return camelizeKeys(data)
  }
}

const api = (configParams = {}) => {
  const axios = Axios.create({ ...config, ...configParams })

  axios.interceptors.request.use((config) => {
    if (auth.isAuthenticated) {
      config.headers['Authorization'] = auth.getToken()
      const adminToken = auth.getAdminToken()
      if (adminToken) config.headers['Admin-Authorization'] = adminToken
    }

    return config
  })

  axios.interceptors.response.use(function(response) {
    return response
  }, function(error) {
    if (error.response.status === 401) {
      if (window.location.href.indexOf('/auth') === -1 && auth.getToken()) {
        window.location = '/auth'
      }
      auth.removeToken()
    } else {
      return Promise.reject(error)
    }
  })

  return axios
}

export default api
