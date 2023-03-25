import 'package:flutter/material.dart';

import '../models/address.dart';
import '../services/index.dart';
import 'package:quiver/strings.dart';

class ShippingMethodModel extends ChangeNotifier {
  Services _service = Services();
  List<ShippingMethod> shippingMethods;
  bool isLoading = true;
  String message;

  void getShippingMethods({Address address, String token}) async {
    try {
      isLoading = true;
      notifyListeners();
      shippingMethods =
          await _service.getShippingMethods(address: address, token: token);
      isLoading = false;
      message = null;
      notifyListeners();
    } catch (err) {
      isLoading = false;
      message =
          "There is an issue with the app during request the data, please contact admin for fixing the issues " +
              err.toString();
      notifyListeners();
    }
  }
}

class ShippingMethod {
  String id;
  String title;
  String description;
  double cost;
  String classCost;
  String methodId;
  String methodTitle;

  Map<String, dynamic> toJson() {
    return {"id": id, "title": title, "description": description, "cost": cost};
  }

  ShippingMethod.fromJson(Map<String, dynamic> parsedJson) {
    try {
      id = "${parsedJson["id"]}";
      title = parsedJson["title"];
      description = parsedJson["description"];
      methodId = parsedJson["method_id"];
      methodTitle = parsedJson["method_title"];
      cost = parsedJson["settings"] != null &&
              parsedJson["settings"]["cost"] != null &&
              isNotBlank(parsedJson["settings"]["cost"]["value"])
          ? double.parse(parsedJson["settings"]["cost"]["value"])
          : 0.0;
      Map settings = parsedJson["settings"];
      settings.keys.forEach((key) {
        if (key is String && key.contains("class_cost_")) {
          classCost = parsedJson["settings"][key]["value"];
        }
      });
    } catch (e) {
      print('error parsing Shipping method');
      throw e;
    }
  }

  ShippingMethod.fromMagentoJson(Map<String, dynamic> parsedJson) {
    id = parsedJson["carrier_code"];
    title = parsedJson["carrier_title"];
    description = parsedJson["method_title"];
    cost = 0;
  }

  ShippingMethod.fromOpencartJson(Map<String, dynamic> parsedJson) {
    Map<String, dynamic> quote = parsedJson["quote"];
    Map<String, dynamic> item =
        quote.values.isNotEmpty ? quote.values.toList()[0] : null;
    id = item != null ? item["code"] : "0";
    title = parsedJson["title"] ?? id;
    description = item != null && item["title"] != null ? item["title"] : "";
    cost = 0;
  }
}
