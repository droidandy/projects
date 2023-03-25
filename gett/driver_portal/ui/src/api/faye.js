import { Client } from 'faye'
import { camelizeKeys } from 'humps'

// @todo we need decide if we need seperate path at the API to server faye
const baseURL = process.env.REACT_APP_API_BASE_URL

class FayeClient {
  get connection() {
    if (!this._connection) {
      this._connection = new Client(`${baseURL}/faye`)
    }

    return this._connection
  }

  on(channel, handler) {
    return this.connection.subscribe(channel, message => handler(camelizeKeys(JSON.parse(message))))
  }
}

export default new FayeClient()
