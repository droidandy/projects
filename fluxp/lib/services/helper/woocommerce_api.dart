/// This library is customize from the woocommerce_api: ^0.0.8

import 'dart:async';
import "dart:collection";
import 'dart:convert';
import "dart:core";
import 'dart:io';
import "dart:math";

import 'package:crypto/crypto.dart' as crypto;
import 'package:http/http.dart' as http;
import 'package:http/io_client.dart';

import '../../common/constants.dart';

class QueryString {
  static Map parse(String query) {
    var search = new RegExp('([^&=]+)=?([^&]*)');
    var result = new Map();

    // Get rid off the beginning ? in query strings.
    if (query.startsWith('?')) query = query.substring(1);
    // A custom decoder.
    decode(String s) => Uri.decodeComponent(s.replaceAll('+', ' '));

    // Go through all the matches and build the result map.
    for (Match match in search.allMatches(query)) {
      result[decode(match.group(1))] = decode(match.group(2));
    }
    return result;
  }
}

class WooCommerceAPI {
  String url;
  String consumerKey;
  String consumerSecret;
  bool isHttps;

  WooCommerceAPI(url, consumerKey, consumerSecret) {
    this.url = url;
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;

    if (this.url.startsWith("https")) {
      this.isHttps = true;
    } else {
      this.isHttps = false;
    }
  }

  _getOAuthURL(String requestMethod, String endpoint, version) {
    var consumerKey = this.consumerKey;
    var consumerSecret = this.consumerSecret;

    var token = "";
    var url = this.url + "/wp-json/wc/v2/" + endpoint;
    // Default one is v3
    if (version == 2) {
      url = this.url + "/wp-json/wc/v2/" + endpoint;
    }
    var containsQueryParams = url.contains("?");

    // If website is HTTPS based, no need for OAuth, just return the URL with CS and CK as query params
    if (this.isHttps == true) {
      return url +
          (containsQueryParams == true
              ? "&consumer_key=" + this.consumerKey + "&consumer_secret=" + this.consumerSecret
              : "?consumer_key=" + this.consumerKey + "&consumer_secret=" + this.consumerSecret);
    }

    var rand = new Random();
    var codeUnits = new List.generate(10, (index) {
      return rand.nextInt(26) + 97;
    });

    var nonce = new String.fromCharCodes(codeUnits);
    int timestamp = (new DateTime.now().millisecondsSinceEpoch ~/ 1000).toInt();

    var method = requestMethod;
    var parameters = "oauth_consumer_key=" +
        consumerKey +
        "&oauth_nonce=" +
        nonce +
        "&oauth_signature_method=HMAC-SHA1&oauth_timestamp=" +
        timestamp.toString() +
        "&oauth_token=" +
        token +
        "&oauth_version=1.0&";

    if (containsQueryParams == true) {
      parameters = parameters + url.split("?")[1];
    } else {
      parameters = parameters.substring(0, parameters.length - 1);
    }

    Map<dynamic, dynamic> params = QueryString.parse(parameters);
    Map<dynamic, dynamic> treeMap = new SplayTreeMap<dynamic, dynamic>();
    treeMap.addAll(params);

    String parameterString = "";

    for (var key in treeMap.keys) {
      parameterString = parameterString + Uri.encodeQueryComponent(key) + "=" + treeMap[key] + "&";
    }

    parameterString = parameterString.substring(0, parameterString.length - 1);
    parameterString = parameterString.replaceAll(' ', '%20');

    var baseString = method +
        "&" +
        Uri.encodeQueryComponent(containsQueryParams == true ? url.split("?")[0] : url) +
        "&" +
        Uri.encodeQueryComponent(parameterString);

    var signingKey = consumerSecret + "&" + token;

    var hmacSha1 = new crypto.Hmac(crypto.sha1, utf8.encode(signingKey)); // HMAC-SHA1
    var signature = hmacSha1.convert(utf8.encode(baseString));

    var finalSignature = base64Encode(signature.bytes);

    var requestUrl = "";

    if (containsQueryParams == true) {
      requestUrl = url.split("?")[0] +
          "?" +
          parameterString +
          "&oauth_signature=" +
          Uri.encodeQueryComponent(finalSignature);
    } else {
      requestUrl = url +
          "?" +
          parameterString +
          "&oauth_signature=" +
          Uri.encodeQueryComponent(finalSignature);
    }
    return requestUrl;
  }

  Future<http.StreamedResponse> getStream(String endPoint) async {
    var client = new http.Client();
    var request = new http.Request('GET', Uri.parse(url));
    return await client.send(request);
  }

  Future<dynamic> getAsync(String endPoint, {int version = 3}) async {
    String url = this._getOAuthURL("GET", endPoint, version);
    var response;

    printLog("[wocommerce_api][${DateTime.now().toString().split(' ').last}] getAsync START [endPoint:$endPoint] url:$url");

    if (debugNetworkProxy) {
      String proxy = Platform.isAndroid ? '192.168.1.10:8888' : 'localhost:9090';
      HttpClient httpClient = new HttpClient();
      httpClient.findProxy = (uri) => "PROXY $proxy;";
      httpClient.badCertificateCallback =
          ((X509Certificate cert, String host, int port) => Platform.isAndroid);
      IOClient myClient = IOClient(httpClient);
      response = await myClient.get(url);
    } else {
      response = await http.get(url);
    }

    printLog("[wocommerce_api][${DateTime.now().toString().split(' ').last}] getAsync END [endPoint:$endPoint] url:$endPoint");

    return json.decode(response.body);
  }

  Future<dynamic> postAsync(String endPoint, Map data, {int version = 3}) async {
    var url = this._getOAuthURL("POST", endPoint, version);

    printLog("[wocommerce_api][${DateTime.now().toString().split(' ').last}] postAsync START [endPoint:$endPoint] url:$url");

    var client;
    if (debugNetworkProxy) {
      String proxy = Platform.isAndroid ? '192.168.1.10:8888' : 'localhost:9090';
      HttpClient httpClient = new HttpClient();
      httpClient.findProxy = (uri) => "PROXY $proxy;";
      httpClient.badCertificateCallback =
          ((X509Certificate cert, String host, int port) => Platform.isAndroid);
      client = IOClient(httpClient);
    } else {
      client = http.Client();
    }

    var request = new http.Request('POST', Uri.parse(url));
    request.headers[HttpHeaders.contentTypeHeader] = 'application/json; charset=utf-8';
    request.headers[HttpHeaders.cacheControlHeader] = "no-cache";
    request.body = json.encode(data);
    var response = await client.send(request).then((res) => res.stream.bytesToString());
    var dataResponse = await json.decode(response);

    printLog("[wocommerce_api][${DateTime.now().toString().split(' ').last}] postAsync END [endPoint:$endPoint]");
    return dataResponse;
  }

  Future<dynamic> putAsync(String endPoint, Map data, {int version = 3}) async {
    var url = this._getOAuthURL("PUT", endPoint, version);

    var client = new http.Client();
    var request = new http.Request('PUT', Uri.parse(url));
    request.headers[HttpHeaders.contentTypeHeader] = 'application/json; charset=utf-8';
    request.headers[HttpHeaders.cacheControlHeader] = "no-cache";
    request.body = json.encode(data);
    var response = await client.send(request).then((res) => res.stream.bytesToString());
    var dataResponse = await json.decode(response);
    return dataResponse;
  }
}
