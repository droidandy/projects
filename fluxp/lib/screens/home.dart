import 'dart:async';

import 'package:after_layout/after_layout.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:uni_links/uni_links.dart';
import '../common/constants.dart';
import '../models/app.dart';
import '../models/category.dart';
import '../screens/deeplink_item.dart';
import '../widgets/home/index.dart';

class HomeScreen extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return HomeScreenState();
  }
}

class HomeScreenState extends State<HomeScreen>
    with AfterLayoutMixin<HomeScreen>, AutomaticKeepAliveClientMixin<HomeScreen> {
  @override
  bool get wantKeepAlive => true;

  Uri _latestUri;
  StreamSubscription _sub;
  int itemId;

  @override
  void dispose() {
    _sub.cancel();
    super.dispose();
  }

  @override
  void initState() {
    printLog("[Home] initState");

    initPlatformState();
    super.initState();
  }

  initPlatformState() async {
    await initPlatformStateForStringUniLinks();
  }

  initPlatformStateForStringUniLinks() async {
    // Attach a listener to the links stream
    _sub = getLinksStream().listen((String link) {
      if (!mounted) return;
      setState(() {
        _latestUri = null;
        try {
          if (link != null) _latestUri = Uri.parse(link);
          setState(() {
            itemId = int.parse(_latestUri.path.split('/')[1]);
          });

          Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => ItemDeepLink(
                      itemId: itemId,
                    )),
          );
        } on FormatException {}
      });
    }, onError: (err) {
      if (!mounted) return;
      setState(() {
        _latestUri = null;
      });
    });

    getLinksStream().listen((String link) {
      print('got link: $link');
    }, onError: (err) {
      print('got err: $err');
    });
  }

  @override
  void afterFirstLayout(BuildContext context) {
    Provider.of<CategoryModel>(context, listen: false).getCategories(lang: Provider.of<AppModel>(context, listen: false).locale);
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    printLog("[Home] build");

    return SafeArea(
      child: Consumer<AppModel>(
        builder: (context, value, child) {
          if (value.appConfig == null) {
            return kLoadingWidget(context);
          }
          return Stack(children: <Widget>[
            HomeLayout(
              configs: value.appConfig,
              key: Key(value.locale),
            ),
          ]);
        },
      ),
    );
  }
}
