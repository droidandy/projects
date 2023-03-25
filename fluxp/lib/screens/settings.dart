import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:notification_permissions/notification_permissions.dart';
import 'package:provider/provider.dart';
import 'package:rate_my_app/rate_my_app.dart';

import '../common/config.dart' as config;
import '../common/constants.dart';
import '../common/styles.dart';
import '../common/tools.dart';
import '../generated/i18n.dart';
import '../models/app.dart';
import '../models/user.dart';
import '../models/wishlist.dart';
import '../widgets/smartchat.dart';
import '../widgets/webview.dart';
import 'currencies.dart';
import 'language.dart';
import 'notification.dart';
import 'user_point.dart';
import 'user_update.dart';

class SettingScreen extends StatefulWidget {
  final User user;
  final VoidCallback onLogout;

  SettingScreen({this.user, this.onLogout});

  @override
  State<StatefulWidget> createState() {
    return SettingScreenState();
  }
}

class SettingScreenState extends State<SettingScreen>
    with
        TickerProviderStateMixin,
        WidgetsBindingObserver,
        AutomaticKeepAliveClientMixin<SettingScreen> {
  @override
  bool get wantKeepAlive => true;

  final bannerHigh = 150.0;
  bool enabledNotification = true;

  RateMyApp _rateMyApp = RateMyApp(
    minDays: 7,
    minLaunches: 10,
    remindDays: 7,
    remindLaunches: 10,
  );

  @override
  void initState() {
    super.initState();

    Future.delayed(Duration.zero, () async {
      checkNotificationPermission();
    });
  }

  @override
  void dispose() {
    setStatusBarWhiteForeground(false);
    super.dispose();
  }

  void checkNotificationPermission() async {
    try {
      NotificationPermissions.getNotificationPermissionStatus().then((status) {
        if (mounted)
          setState(() {
            enabledNotification = status == PermissionStatus.granted;
          });
      });
    } catch (err) {
//      print(err);
    }
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      checkNotificationPermission();
    }
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    final wishListCount = Provider.of<WishListModel>(context, listen: false).products.length;
    final screenSize = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: Theme.of(context).backgroundColor,
      floatingActionButton: config.kAdvanceConfig["EnableSmartChat"]
          ? SmartChat(
            user: widget.user,
            margin: EdgeInsets.only(
                right:
                    Provider.of<AppModel>(context, listen: false).locale == 'ar' ? 30.0 : 0.0),
          )
          : Container(),
      body: CustomScrollView(
        slivers: <Widget>[
          SliverAppBar(
            backgroundColor: Color(0xFF0084C9),
            leading: IconButton(
              icon: Icon(
                Icons.blur_on,
                color: Colors.white70,
              ),
              onPressed: () {
                Scaffold.of(context).openDrawer();
              },
            ),
            expandedHeight: bannerHigh,
            floating: true,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              title: Text(S.of(context).settings,
                  style: TextStyle(fontSize: 18, color: Colors.white, fontWeight: FontWeight.w600)),
              background: Image.network(
                kProfileBackground,
                fit: BoxFit.cover,
              ),
            ),
          ),
          SliverList(
            delegate: SliverChildListDelegate(
              <Widget>[
                Container(
                  width: screenSize.width,
                  child: Container(
                    width: screenSize.width / (2 / (screenSize.height / screenSize.width)),
                    child: Padding(
                      padding: const EdgeInsets.all(15.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          SizedBox(
                            height: 10.0,
                          ),
                          if (widget.user != null && widget.user.name != null)
                            ListTile(
                              leading: widget.user.picture != null
                                  ? CircleAvatar(
                                      backgroundImage: NetworkImage(widget.user.picture))
                                  : Icon(Icons.face),
                              title: Text(widget.user.name.replaceAll("fluxstore", ""),
                                  style: TextStyle(fontSize: 16)),
                            ),
                          if (widget.user != null && widget.user.email != null)
                            ListTile(
                              leading: Icon(Icons.email),
                              title: Text(widget.user.email, style: TextStyle(fontSize: 16)),
                            ),
                          if (widget.user != null)
                            Card(
                              color: Theme.of(context).backgroundColor,
                              margin: EdgeInsets.only(bottom: 2.0),
                              elevation: 0,
                              child: ListTile(
                                leading: Icon(
                                  Icons.portrait,
                                  color: Theme.of(context).accentColor,
                                  size: 25,
                                ),
                                title: Text(S.of(context).updateUserInfor,
                                    style: TextStyle(fontSize: 15)),
                                trailing:
                                    Icon(Icons.arrow_forward_ios, size: 18, color: kGrey600),
                                onTap: () {
                                  Navigator.push(context,
                                      MaterialPageRoute(builder: (context) => UserUpdate()));
                                },
                              ),
                            ),
                          if (widget.user == null)
                            Card(
                              color: Theme.of(context).backgroundColor,
                              margin: EdgeInsets.only(bottom: 2.0),
                              elevation: 0,
                              child: ListTile(
                                onTap: () => Navigator.pushNamed(context, "/login"),
                                leading: Icon(Icons.person),
                                title: Text(S.of(context).login, style: TextStyle(fontSize: 16)),
                                trailing:
                                    Icon(Icons.arrow_forward_ios, size: 18, color: kGrey600),
                              ),
                            ),
                          if (widget.user != null)
                            Card(
                              color: Theme.of(context).backgroundColor,
                              margin: EdgeInsets.only(bottom: 2.0),
                              elevation: 0,
                              child: ListTile(
                                onTap: widget.onLogout,
                                leading: Image.asset(
                                  'assets/icons/profile/icon-logout.png',
                                  width: 24,
                                  color: Theme.of(context).accentColor,
                                ),
                                title: Text(S.of(context).logout, style: TextStyle(fontSize: 16)),
                                trailing:
                                    Icon(Icons.arrow_forward_ios, size: 18, color: kGrey600),
                              ),
                            ),
                          SizedBox(height: 30.0),
                          Text(S.of(context).generalSetting,
                              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
                          SizedBox(height: 10.0),
                          if (widget.user != null)
                            Divider(
                              color: Colors.black12,
                              height: 1.0,
                              indent: 75,
                              //endIndent: 20,
                            ),
                          Card(
                            margin: EdgeInsets.only(bottom: 2.0),
                            elevation: 0,
                            child: ListTile(
                              leading: Icon(
                                Icons.favorite_border,
                                color: Theme.of(context).accentColor,
                                size: 26,
                              ),
                              title:
                                  Text(S.of(context).myWishList, style: TextStyle(fontSize: 15)),
                              trailing: Row(mainAxisSize: MainAxisSize.min, children: [
                                if (wishListCount > 0)
                                  Text(
                                    "$wishListCount ${S.of(context).items}",
                                    style: TextStyle(
                                        fontSize: 14, color: Theme.of(context).primaryColor),
                                  ),
                                SizedBox(width: 5),
                                Icon(Icons.arrow_forward_ios, size: 18, color: kGrey600)
                              ]),
                              onTap: () {
                                Navigator.pushNamed(context, "/wishlist");
                              },
                            ),
                          ),
                          Divider(
                            color: Colors.black12,
                            height: 1.0,
                            indent: 75,
                            //endIndent: 20,
                          ),
                          Card(
                            margin: EdgeInsets.only(bottom: 2.0),
                            elevation: 0,
                            child: SwitchListTile(
                              secondary: Icon(
                                Icons.notifications_none,
                                color: Theme.of(context).accentColor,
                                size: 26,
                              ),
                              value: enabledNotification,
                              activeColor: Color(0xFF0066B4),
                              onChanged: (bool value) {
                                if (value) {
                                  NotificationPermissions.requestNotificationPermissions(
                                    iosSettings: NotificationSettingsIos(
                                        sound: true, badge: true, alert: true),
                                  ).then((_) {
                                    checkNotificationPermission();
                                  });
                                }
                                setState(() {
                                  enabledNotification = value;
                                });
                              },
                              title: Text(
                                S.of(context).getNotification,
                                style: TextStyle(fontSize: 16),
                              ),
                            ),
                          ),
                          Divider(
                            color: Colors.black12,
                            height: 1.0,
                            indent: 75,
                            //endIndent: 20,
                          ),
                          enabledNotification
                              ? Card(
                                  margin: EdgeInsets.only(bottom: 2.0),
                                  elevation: 0,
                                  child: GestureDetector(
                                    onTap: () {
                                      Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                              builder: (context) => Notifications()));
                                    },
                                    child: ListTile(
                                      leading: Icon(
                                        Icons.list,
                                        size: 24,
                                        color: Theme.of(context).accentColor,
                                      ),
                                      title: Text(S.of(context).listMessages),
                                      trailing: Icon(
                                        Icons.arrow_forward_ios,
                                        size: 18,
                                        color: kGrey600,
                                      ),
                                    ),
                                  ),
                                )
                              : Container(),
                          enabledNotification
                              ? Divider(
                                  color: Colors.black12,
                                  height: 1.0,
                                  indent: 75,
                                  //endIndent: 20,
                                )
                              : Container(),
                          Divider(
                            color: Colors.black12,
                            height: 1.0,
                            indent: 75,
                            //endIndent: 20,
                          ),
                          Card(
                            margin: EdgeInsets.only(bottom: 2.0),
                            elevation: 0,
                            child: GestureDetector(
                              onTap: () {
                                Navigator.push(
                                    context, MaterialPageRoute(builder: (context) => Language()));
                              },
                              child: ListTile(
                                leading: Icon(
                                  Icons.language,
                                  color: Theme.of(context).accentColor,
                                  size: 24,
                                ),
                                title: Text(S.of(context).language),
                                trailing: Icon(
                                  Icons.arrow_forward_ios,
                                  size: 18,
                                  color: kGrey600,
                                ),
                              ),
                            ),
                          ),
                          Divider(
                            color: Colors.black12,
                            height: 1.0,
                            indent: 75,
                            //endIndent: 20,
                          ),
                          Card(
                            margin: EdgeInsets.only(bottom: 2.0),
                            elevation: 0,
                            child: ListTile(
                              onTap: () {
                                Navigator.push(context,
                                    MaterialPageRoute(builder: (context) => Currencies()));
                              },
                              leading: Icon(FontAwesomeIcons.dollarSign,
                                  size: 22, color: Theme.of(context).accentColor),
                              title:
                                  Text(S.of(context).currencies, style: TextStyle(fontSize: 16)),
                              trailing: Icon(Icons.arrow_forward_ios, size: 18, color: kGrey600),
                            ),
                          ),
                          Divider(
                            color: Colors.black12,
                            height: 1.0,
                            indent: 75,
                            //endIndent: 20,
                          ),
                          Card(
                            margin: EdgeInsets.only(bottom: 2.0),
                            elevation: 0,
                            child: SwitchListTile(
                              secondary: Icon(
                                Icons.brightness_2,
                                color: Theme.of(context).accentColor,
                                size: 24,
                              ),
                              value: Provider.of<AppModel>(context).darkTheme,
                              activeColor: Color(0xFF0066B4),
                              onChanged: (bool value) {
                                if (value) {
                                  Provider.of<AppModel>(context, listen: false).updateTheme(true);
                                } else
                                  Provider.of<AppModel>(context, listen: false)
                                      .updateTheme(false);
                              },
                              title: Text(
                                S.of(context).darkTheme,
                                style: TextStyle(fontSize: 16),
                              ),
                            ),
                          ),
                          if (widget.user != null)
                            StreamBuilder<QuerySnapshot>(
                              stream: Firestore.instance.collection('fluxbuilder').snapshots(),
                              builder: (context, snapshot) {
                                if (!snapshot.hasData)
                                  return Container();
                                else {
                                  final data = snapshot.data.documents.firstWhere(
                                      (test) => test.documentID == widget.user.email,
                                      orElse: () => null);
                                  if (data == null) return Container();
                                  return Card(
                                    margin: EdgeInsets.only(bottom: 2.0),
                                    elevation: 0,
                                    child: SwitchListTile(
                                      secondary: Icon(
                                        Icons.slideshow,
                                        color: Theme.of(context).accentColor,
                                        size: 24,
                                      ),
                                      value: Provider.of<AppModel>(context).showDemo,
                                      activeColor: Color(0xFF0066B4),
                                      onChanged: (bool value) {
                                        Provider.of<AppModel>(context, listen: false)
                                            .updateShowDemo(value);
                                        Provider.of<AppModel>(context, listen: false)
                                            .updateUsername(widget.user.email);
                                        if (value) {
                                          Provider.of<AppModel>(context, listen: false)
                                              .loadStreamConfig(data.data);
                                        } else {
                                          Provider.of<AppModel>(context, listen: false)
                                              .loadAppConfig();
                                        }
                                      },
                                      title: Text(
                                        'Development Mode',
                                        style: TextStyle(fontSize: 16),
                                      ),
                                    ),
                                  );
                                }
                              },
                            ),
                          SizedBox(height: 30.0),
                          Text(S.of(context).orderDetail,
                              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600)),
                          SizedBox(height: 10.0),
                          if (widget.user != null)
                            GestureDetector(
                              onTap: () {
                                Navigator.pushNamed(context, "/orders");
                              },
                              child: Card(
                                margin: EdgeInsets.only(bottom: 2.0),
                                elevation: 0,
                                child: ListTile(
                                  leading: Icon(
                                    Icons.history,
                                    color: Theme.of(context).accentColor,
                                    size: 24,
                                  ),
                                  title: Text(S.of(context).orderHistory,
                                      style: TextStyle(fontSize: 16)),
                                  trailing:
                                      Icon(Icons.arrow_forward_ios, size: 18, color: kGrey600),
                                ),
                              ),
                            ),
                          if (config.kAdvanceConfig['EnablePointReward'] == true &&
                              widget.user != null)
                            Divider(
                              color: Colors.black12,
                              height: 1.0,
                              indent: 75,
                              //endIndent: 20,
                            ),
                          if (config.kAdvanceConfig['EnablePointReward'] == true &&
                              widget.user != null)
                            InkWell(
                              onTap: () {
                                Navigator.push(context,
                                    MaterialPageRoute(builder: (context) => UserPoint()));
                              },
                              child: Card(
                                margin: EdgeInsets.only(bottom: 2.0),
                                elevation: 0,
                                child: ListTile(
                                  leading: Icon(
                                    Icons.control_point_duplicate,
                                    color: Theme.of(context).accentColor,
                                    size: 24,
                                  ),
                                  title: Text(S.of(context).myPoints,
                                      style: TextStyle(fontSize: 16)),
                                  trailing:
                                      Icon(Icons.arrow_forward_ios, size: 18, color: kGrey600),
                                ),
                              ),
                            ),
                          Divider(
                            color: Colors.black12,
                            height: 1.0,
                            indent: 75,
                            //endIndent: 20,
                          ),
                          if (config.kAdvanceConfig["EnableRating"])
                            Card(
                              margin: EdgeInsets.only(bottom: 2.0),
                              elevation: 0,
                              child: ListTile(
                                onTap: () {
                                  _rateMyApp.showRateDialog(context).then((v) => setState(() {}));
                                },
                                leading: Icon(
                                  FontAwesomeIcons.star,
                                  color: Theme.of(context).accentColor,
                                  size: 21,
                                ),
                                title: Text(S.of(context).rateTheApp,
                                    style: TextStyle(fontSize: 16)),
                                trailing:
                                    Icon(Icons.arrow_forward_ios, size: 18, color: kGrey600),
                              ),
                            ),
                          Card(
                            margin: EdgeInsets.only(bottom: 2.0),
                            elevation: 0,
                            child: ListTile(
                              onTap: () => {
                                Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                        builder: (context) => WebView(
                                            url: "https://inspireui.com/about",
                                            title: "About Us")))
                              },
                              leading: Icon(
                                Icons.info_outline,
                                color: Theme.of(context).accentColor,
                              ),
                              title: Text(S.of(context).aboutUs, style: TextStyle(fontSize: 16)),
                              trailing: Icon(Icons.arrow_forward_ios, size: 18, color: kGrey600),
                            ),
                          ),
                          Divider(
                            color: Colors.black12,
                            height: 1.0,
                            indent: 75,
                            //endIndent: 20,
                          ),
                          SizedBox(
                            height: 100,
                          )
                        ],
                      ),
                    ),
                  ),
                )
              ],
            ),
          ),
        ],
      ),
    );
  }
}
