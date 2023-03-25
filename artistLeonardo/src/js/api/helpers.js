/**
 * Created by developercomputer on 11.11.15.
 */
export function createNonce(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function parseResponseParameters(response) {
  if (response.split) {
    var parameters = response.split("&");
    var parameterMap = {};
    for(var i = 0; i < parameters.length; i++) {
      parameterMap[parameters[i].split("=")[0]] = parameters[i].split("=")[1];
    }
    return parameterMap;
  }
  else {
    return {};
  }
}

/*
 * Function for creating signature
 *
 * @param {string} method Method that will be used for generating base string
 * @param {string} baseURL URL thaht will be used for generating base string
 * @param {object} params base of request
 * @param {string} key It will be used for generating HMAC-SHA1 signature
 * @return {string} HMAC_SHA1 encrypted signature
 * */
export function createSignatureV2(method, baseURL, params, key) {
  var signatureBaseString = method + "&" + encodeURIComponent(baseURL) + "&";
  var parametersKeys = (Object.keys(params)).sort();
  for(let i = 0; i < parametersKeys.length; i++) {
    if(i == parametersKeys.length - 1) {
      signatureBaseString += encodeURIComponent(parametersKeys[i] + "=" + params[parametersKeys[i]]);
    } else {
      signatureBaseString += encodeURIComponent(parametersKeys[i] + "=" + params[parametersKeys[i]] + "&");
    }
  }
  console.log("signatureBaseString: \n");
  console.log(signatureBaseString);
  console.log("_____________________\n");
  return encodeURIComponent(CryptoJS.HmacSHA1(signatureBaseString, key).toString(CryptoJS.enc.Base64));
}

/*
 * Function to form url
 *
 * @param {string} baseURL
 * @param {object} params Parameters of query
 * @return {string} string that will be used for ajax-calls
 * */
export function createQuery(baseURL, params) {
  var parametersKeys = (Object.keys(params)).sort();
  var query = `${baseURL}?`;
  for(let i = 0; i < parametersKeys.length; i++) {
    if(i == parametersKeys.length - 1) {
      query += parametersKeys[i] + "=" + params[parametersKeys[i]];
    } else {
      query += parametersKeys[i] + "=" + params[parametersKeys[i]] + "&";
    }
  }
  return query;
}

export function fixedEncodeURIComponent (str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

export function convertImgToDataURL(url, callback, outputFormat) {
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function() {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var dataURL;
    canvas.height = this.height;
    canvas.width = this.width;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL(outputFormat);
    callback(dataURL);
    canvas = null;
  };
  img.src = url;
}

