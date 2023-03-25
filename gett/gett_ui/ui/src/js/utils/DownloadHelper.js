import snakeCase from 'lodash/snakeCase';
import { auth } from 'utils';

export default class DownloadHelper {
  constructor(action) {
    this.action = action;
  }

  get form() {
    return document.querySelector('#contentDownloadForm');
  }

  get dataContainer() {
    return document.querySelector('#contentDownloadForm .data');
  }

  setDownloadToken() {
    const token = new Date().getTime();
    document.querySelector('#contentDownloadForm .downloadToken').value = token;
    return token;
  }

  setAuthToken() {
    document.querySelector('#contentDownloadForm .token').value = auth.getToken();
  }

  post(params = {}) {
    return this.submit('post', { ...params, token: auth.getToken() });
  }

  get(params) {
    this.setAuthToken();
    return this.submit('get', params);
  }

  submit(method, params) {
    function poll(token, resolve) {
      const interval = setInterval(() => {
        if (document.cookie.includes(`download_token=${token}`)) {
          document.cookie = `download_token=${token}; expires=${new Date(0).toGMTString()}; path=/`;
          clearInterval(interval);
          resolve();
        }
      }, 500);
    }

    return new Promise((resolve) => {
      const token = this.setDownloadToken();

      this.addParams(params);
      Object.assign(this.form, { method, action: this.action  });
      this.form.submit();
      this.cleanup();
      poll(token, resolve);
    });
  }

  addParams(params) {
    const fragment = document.createDocumentFragment();

    for (const name in params) {
      const input = document.createElement('input');
      Object.assign(input, { type: 'hidden', name: snakeCase(name), value: params[name] });
      fragment.appendChild(input);
    }
    this.dataContainer.appendChild(fragment);
  }

  cleanup() {
    this.dataContainer.innerHTML = '';
  }
}
