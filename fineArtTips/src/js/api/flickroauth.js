/**
 * Created by developercomputer on 02.11.15.
 */
var flickrAPI = require("./flickr");
import {createNonce, parseResponseParameters, createSignatureV2, createQuery} from "./helpers.js";
//here is some callback-hell. Don't mind.
function AuthorizationV2(api_key, api_secret, callback) {
  //Getting a Request Token
  var redirect_uri = "https://www.facebook.com/connect/login_success.html";
  let requestTokenURL = "https://www.flickr.com/services/oauth/request_token";
  /*
   * Request example
   * https://www.flickr.com/services/oauth/request_token
   * ?oauth_nonce=95613465
   * &oauth_timestamp=1305586162
   * &oauth_consumer_key=653e7a6ecc1d528c516cc8f92cf98611
   * &oauth_signature_method=HMAC-SHA1
   * &oauth_version=1.0
   * &oauth_signature=7w18YS2bONDPL%2FzgyzP5XTr5af4%3D
   * &oauth_callback=http%3A%2F%2Fwww.example.com
   */
  let requestTokenData = {
    oauth_nonce: createNonce(8),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
    oauth_version: "1.0",
    oauth_callback: encodeURIComponent(redirect_uri),
    oauth_consumer_key: api_key
  };
  /*
   В документации фликера нигде не указано что ключ для энкриптинга
   сигнатуры для получения request token'a должен быть в формате api_secret + & + пустая строка
   Но оно так.
   */
  const KEY = `${encodeURIComponent(api_secret)}&`;
  requestTokenData.oauth_signature = createSignatureV2("GET", requestTokenURL, requestTokenData, KEY);
  $$.ajax({
    method: "GET",
    url: createQuery(requestTokenURL, requestTokenData),
    success: res => {
      var responseRequestToken = parseResponseParameters(res);
      if(responseRequestToken.hasOwnProperty("oauth_token") === false) {
        throw new Error("Oauth request token was not received");
      }
      var oauth_token_secret = responseRequestToken.oauth_token_secret;
      //User's authorization
      let authorizeUrl = `https://www.flickr.com/services/oauth/authorize?oauth_token=${responseRequestToken.oauth_token}&perms=write`;
      var browserRef = window.open(authorizeUrl, '_blank', 'location=no');
      browserRef.addEventListener('loadstart', event => {
        if ((event.url).indexOf(redirect_uri) === 0) {
          var callbackResponse = (event.url).split("?")[1];
          var verifier = parseResponseParameters(callbackResponse);
          if (verifier.hasOwnProperty("oauth_verifier") === false) {
            throw new Error("Browser authentication failed to complete.  No oauth_verifier was returned");
          }
          //Exchanging the Request Token for an Access Token
          let accessTokenURL = "https://www.flickr.com/services/oauth/access_token";
          /*
           * https://www.flickr.com/services/oauth/access_token
           * ?oauth_nonce=37026218
           * &oauth_timestamp=1305586309
           * &oauth_verifier=5d1b96a26b494074
           * &oauth_consumer_key=653e7a6ecc1d528c516cc8f92cf98611
           * &oauth_signature_method=HMAC-SHA1
           * &oauth_version=1.0
           * &oauth_token=72157626737672178-022bbd2f4c2f3432
           * &oauth_signature=UD9TGXzrvLIb0Ar5ynqvzatM58U%3D
           * */
          let accessTokenData = {
            oauth_nonce: createNonce(8),
            oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
            oauth_consumer_key: api_key,
            oauth_signature_method: "HMAC-SHA1",
            oauth_version: "1.0",
            oauth_token: verifier.oauth_token,
            oauth_verifier: verifier.oauth_verifier
          };
          const KEY_FOR_ACCESS = `${api_secret}&${oauth_token_secret}`;
          accessTokenData.oauth_signature = createSignatureV2("GET", accessTokenURL, accessTokenData, KEY_FOR_ACCESS);
          $$.ajax({
            method: "GET",
            url: createQuery(accessTokenURL, accessTokenData),
            success: res => {
              var oauth_data = parseResponseParameters(decodeURIComponent(res));
              //https://api.flickr.com/services/rest/?method=flickr.auth.checkToken&api_key=e69803ca4d8d91e87f2fa28fe1092b44&format=json&nojsoncallback=1&auth_token=72157661122551345-1a3175e5dd7a4c73&api_sig=758e8ab6fb42805b13126321b2a63303
              var data = {
                method: `flickr.auth.oauth.getAccessToken`,
                oauth_token: oauth_data.oauth_token
              };
              const key = `${api_secret}&${oauth_data.oauth_token_secret}`;
              console.log(flickrAPI.universalQuery("GET","https://api.flickr.com/services/rest/", data, key));
              var data2 = {
                method: `flickr.auth.oauth.getAccessToken`,
                api_key: api_key,
                auth_token: oauth_data.oauth_token
              };
              console.log(data2);
              data2.api_sig = flickrAPI.get_api_sig(data2, oauth_data.oauth_token_secret);
              var url = `https://api.flickr.com/services/rest/`;
              url += `?method=${data2.method}`;
              url += `&api_key=${data2.api_key}`;
              url += `&auth_token=${data2.auth_token}`;
              url += `&api_sig=${data2.api_sig}`;
              console.log(url);
              //https://api.flickr.com/services/rest/?method=flickr.test.login&api_key=e69803ca4d8d91e87f2fa28fe1092b44&format=rest&auth_token=72157661090725082-62382dec0b0c50e0&api_sig=f293137ec696e636907713dac17ffae2
              var data3 = {
                method: `flickr.test.login`,
                api_key: api_key,
                auth_token: oauth_data.oauth_token
              };
              console.log(data3);
              data3.api_sig = flickrAPI.get_api_sig(data3, oauth_data.oauth_token_secret);
              var url2 = `https://api.flickr.com/services/rest/`;
              url2 += `?method=${data3.method}`;
              url2 += `&api_key=${data3.api_key}`;
              url2 += `&auth_token=${data3.auth_token}`;
              url2 += `&api_sig=${data3.api_sig}`;
              console.log(url2);
              var data4 = {
                method: `flickr.test.login`,
                oauth_token: oauth_data.oauth_token
              };
              console.log(flickrAPI.universalQuery("GET","https://api.flickr.com/services/rest/", data4, key));
              callback(oauth_data);
              browserRef.close();
            },
            error() {
              console.warn("Failed to get access token");
              browserRef.close();
            }
          });
        }
      });
      browserRef.addEventListener("exit", e => console.log("user left"));
    },
    error() {
      console.warn("IT IS SOME ERROR :(");
    }
  })
}


const init = callback => {
  return AuthorizationV2(flickrAPI.api_key, flickrAPI.api_secret, callback);
};

module.exports = init;