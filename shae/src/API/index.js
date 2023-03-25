/**
 * Created by konstantin on 29.07.16.
 */

import {Platform} from 'react-native'


export default class API {

    static AuthToken = null;

    static host = 'https://dev-app.ph360.me/mobile/';

    static ipApiInfo() {
        return fetch('http://ip-api.com/json')
            .then(r => r.json())
            .catch(e => e);
    }

    static async signIn(email, pass) {

        let signInResult = null;
        try {
            signInResult = await API.POST('auth', {user: email, pass: pass});
        } catch (e) {
            console.log(e)
            throw new Error(e);
        }

        API.AuhToken = signInResult.token;

        return signInResult;
    }

    static call(method, type, data) {

        function status(response) {
            console.log('status', response.status);
            if (response.status >= 200 && response.status < 300) {
                return Promise.resolve(response)
            } else {
                return response.text().then(text => {
                    return Promise.reject({
                        error: {
                            ok: response.ok,
                            status: response.status,
                            statusText: response.statusText
                        },
                        body: text
                    });
                });
                /*return response.json().then(json => {
                    return Promise.reject({
                        error: {
                            ok: response.ok,
                            status: response.status,
                            statusText: response.statusText
                        },
                        body: json
                    });
                });*/
            }
        }

        function json(response) {
            return response.json()
        }

        return API
            .request(method, type, data)
            .then(status)
            .then(json)
            .catch(e => Promise.reject(e));
    }

    static async GET(method, params) {

        let paramsArr = [],
            paramsStr = '',
            paramsType = typeof params;
        
        if (paramsType == 'object') {
            for (let p in params) {
                if (!params.hasOwnProperty(p)) continue;
        
                let val = params[p];
                if (typeof val == 'object') {
                    val = JSON.stringify(val);
                }
                paramsArr.push(`${p}=${val}`);
            }
            paramsStr = `?${paramsArr.join('&')}`;
        } else if (paramsType == 'string') {
            paramsStr = `?${params}`;
        }

        return await API.call(`${method}`, 'get');
    }

    static async POST(method, params) {
        return API.call(method, 'post', params);
    }


    static androidThreadSleepHackInterval = null;

    static androidThreadSleepHack() {
        if (!API.androidThreadSleepHackInterval) {
            API.androidThreadSleepHackInterval = setInterval(() => {
                let i = 0;
                i++;
            }, 1000);
        }
    }

    static request(method, type, data, headers) {
        if (Platform.OS == 'android') {
            API.androidThreadSleepHack();
        }

        if (!headers) {
            headers = {};
        }
        if (API.AuthToken) {
            console.log('User-Token', API.AuthToken)
            headers["User-Token"] = `${API.AuthToken}`;
        }
        headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";


        let _body = '';
        if (typeof data == 'object') {
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    let value = data[key];
                    if (typeof value == 'object') {
                        value = JSON.stringify(value);
                    }
                    _body += (_body.length ? '&' : '') + key + '=' + encodeURIComponent(value);
                }
            }
        } else {
            _body = data;
        }

        //console.log('Headers', headers);
        //console.log('Parameters', data)

        return fetch(API.host + method, {
            method: type || 'get',
            headers,
            body: _body
        });
    }
}
