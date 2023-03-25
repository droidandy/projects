import { call, select } from "redux-saga/effects"
import axios from "axios"
import LocalStorageService from "../libs/TokenService";

const headers = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

export function * request(url, config) {
  try {
    const token = yield select(LocalStorageService.getToken)
    const requestConfig = {
      url: url,
      ...headers(token),
      ...config
    }

    return yield call(axios.request, requestConfig)
  } catch (e) {
    console.log("API Request error", e)

    return e
  }
}

export function * getRequest(url, config) {
  return yield request(url, {
    method: "get",
    ...config
  })
}

export function * postWithoutTokenRequest(url, data) {
  return yield request(url, {
    method: "post",
    data: {
      ...data
    }
  })
}

export function * putWithoutTokenRequest(url, data) {
  return yield request(url, {
    method: "put",
    data: {
      ...data
    }
  })
}

export function * postRequest(url, data, config) {
  return yield request(url, {
    method: "post",
    data: {
      ...data
    },
    ...config
  })
}

export function * putRequest(url, data) {
  return yield request(url, {
    method: "put",
    data: {
      ...data
    }
  })
}

export function * deleteRequest(url, data) {
  return yield request(url, {
    method: "delete",
    data: {
      ...data
    }
  })
}
