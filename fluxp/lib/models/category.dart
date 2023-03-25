import 'package:flutter/material.dart';
import '../services/index.dart';
import '../common/constants.dart';
import 'package:html_unescape/html_unescape.dart';

class CategoryModel with ChangeNotifier {
  Services _service = Services();
  List<Category> categories;
  Map<int, Category> categoryList = {};

  bool isLoading = true;
  String message;

  void getCategories({lang}) async {
    try {
      printLog("[Category] getCategories");
      
      categories = await _service.getCategories(lang: lang);
      isLoading = false;
      message = null;
      for (Category cat in categories) {
        categoryList[cat.id] = cat;
      }
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

class Category {
  int id;
  String name;
  String image;
  int parent;
  int totalProduct;

  Category.fromJson(Map<String, dynamic> parsedJson) {
    if (parsedJson["slug"] == 'uncategorized') {
      return;
    }

    id = parsedJson["id"];
    name = HtmlUnescape().convert(parsedJson["name"]);
    parent = parsedJson["parent"];
    totalProduct = parsedJson["count"];

    final image = parsedJson["image"];
    if (image != null) {
      this.image = image["src"].toString();
    } else {
      this.image = kDefaultImage;
    }
  }

  Category.fromOpencartJson(Map<String, dynamic> parsedJson) {
    id = parsedJson["id"] != null ? int.parse(parsedJson["id"]) : 0;
    name = parsedJson["name"];
    image = parsedJson["image"] != null ? parsedJson["image"] : kDefaultImage;
    totalProduct = parsedJson["count"] != null
        ? int.parse(parsedJson["count"].toString())
        : 0;
    parent = parsedJson["parent"] != null
        ? int.parse(parsedJson["parent"].toString())
        : 0;
  }

  Category.fromMagentoJson(Map<String, dynamic> parsedJson) {
    id = parsedJson["id"];
    name = parsedJson["name"];
    image = parsedJson["image"] != null ? parsedJson["image"] : kDefaultImage;
    parent = parsedJson["parent_id"];
    totalProduct = parsedJson["product_count"];
  }

  @override
  String toString() => 'Category { id: $id  name: $name}';
}
