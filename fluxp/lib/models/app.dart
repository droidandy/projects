import 'package:flutter/material.dart';
import 'dart:convert' as convert;
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import '../common/constants.dart';
import 'package:provider/provider.dart';
import '../models/category.dart';
import '../services/magento.dart';
import '../services/index.dart';
import '../common/config.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:localstorage/localstorage.dart';
import 'cart.dart';

class AppModel with ChangeNotifier {
  MagentoApi _magentoApi = MagentoApi();
  Map<String, dynamic> appConfig;
  bool isLoading = true;
  String message;
  bool darkTheme = false;
  String locale = kAdvanceConfig['DefaultLanguage'];
  String productListLayout;
  String currency; //USD, VND
  bool showDemo = false;
  String username;
  bool isInit = false;
  Function(int) navigateTab;

  void updateNavigateTab(value) {
    navigateTab = value;
    notifyListeners();
  }

  AppModel() {
    getConfig();
  }

  Future<bool> getConfig() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      locale = prefs.getString("language") ?? kAdvanceConfig['DefaultLanguage'];
      darkTheme = prefs.getBool("darkTheme") ?? false;
      currency = prefs.getString("currency") ??
          (kAdvanceConfig['DefaultCurrency'] as Map)['currency'];
      isInit = true;
      return true;
    } catch (err) {
      return false;
    }
  }

  void changeLanguage(String country, BuildContext context) async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      locale = country;
      Provider.of<CategoryModel>(context, listen: false)
          .getCategories(lang: country);
      await prefs.setString("language", country);
      await loadAppConfig();
      notifyListeners();
    } catch (err) {}
  }

  void changeCurrency(String item, BuildContext context) async {
    try {
      Provider.of<CartModel>(context, listen: false).changeCurrency(item);
      SharedPreferences prefs = await SharedPreferences.getInstance();
      currency = item;
      await prefs.setString("currency", currency);
      notifyListeners();
    } catch (err) {}
  }

  void updateTheme(bool theme) async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      darkTheme = theme;
      await prefs.setBool("darkTheme", theme);
      notifyListeners();
    } catch (e) {}
  }

  void updateShowDemo(bool value) {
    showDemo = value;
    notifyListeners();
  }

  void updateUsername(String user) {
    username = user;
    notifyListeners();
  }

  void loadStreamConfig(config) {
    appConfig = config;
    productListLayout = appConfig['Setting']['ProductListLayout'];
    isLoading = false;
    notifyListeners();
  }

  Future<void> loadAppConfig() async {
    try {
      if (!isInit) {
        await getConfig();
      }
      final LocalStorage storage = LocalStorage('builder');
      var config = await storage.getItem('config');
      if (config != null) {
        appConfig = config;
      } else {
        if (kAppConfig.indexOf('http') != -1) {
          // load on cloud config and update on air
          final appJson = await http.get(Uri.encodeFull(kAppConfig),
              headers: {"Accept": "application/json"});
          appConfig = convert.jsonDecode(appJson.body);
        } else {
          // load local config
          String path = "lib/common/config_$locale.json";
          try {
            final appJson = await rootBundle.loadString(path);
            appConfig = convert.jsonDecode(appJson);
          } catch (e) {
            final appJson = await rootBundle.loadString(kAppConfig);
            appConfig = convert.jsonDecode(appJson);
          }
        }
      }
      productListLayout = appConfig['Setting']['ProductListLayout'];
      if (serverConfig["type"] == "magento") {
        _magentoApi.getAllAttributes();
      }
      if (serverConfig["type"] == "woo" && kAdvanceConfig['isCaching']) {
        final configCache = await Services().getHomeCache();
        if (configCache != null) {
          appConfig = configCache;
        }
      }
      isLoading = false;
      notifyListeners();
    } catch (err) {
      isLoading = false;
      message = err.toString();
      notifyListeners();
    }
  }

  void updateProductListLayout(layout) {
    productListLayout = layout;
    notifyListeners();
  }
}

class App {
  Map<String, dynamic> appConfig;

  App(this.appConfig);
}
