import 'dart:async';
import 'dart:io';
import 'package:connectivity/connectivity.dart';

import '../common/constants.dart';

class MyConnectivity {
  MyConnectivity._internal();
  static final MyConnectivity _instance = MyConnectivity._internal();
  static MyConnectivity get instance => _instance;

  Connectivity connectivity = Connectivity();
  
  StreamController controller = StreamController.broadcast();
  Stream get myStream => controller.stream;
  bool isShow = false;

  void initialise() async {
    ConnectivityResult result = await connectivity.checkConnectivity();
    _checkStatus(result);
    connectivity.onConnectivityChanged.listen((result) {
      _checkStatus(result);
    });
  }

  void _checkStatus(ConnectivityResult result) async {
    bool isOnline = false;
    try {
      final result = await InternetAddress.lookup('google.com');
      if (result.isNotEmpty && result[0].rawAddress.isNotEmpty) {
        printLog("[MyConnectivity] online");
        isOnline = true;
      } else{
        printLog("[MyConnectivity] offline");
        isOnline = false;

      }
    } on SocketException catch (_) {
      isOnline = false;
    }
    controller.sink.add({result: isOnline});
  }
  bool isIssue(dynamic onData) => onData.keys.toList()[0] == ConnectivityResult.none;

  void disposeStream() => controller.close();
}