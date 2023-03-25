import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../generated/i18n.dart';
import '../../models/order.dart';
import '../../models/user.dart';

class OrderedSuccess extends StatelessWidget {
  final Order order;

  OrderedSuccess({this.order});

  @override
  Widget build(BuildContext context) {
    final userModel = Provider.of<UserModel>(context);

    return ListView(
      //crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Container(
          margin: EdgeInsets.only(top: 20),
          decoration: BoxDecoration(color: Theme.of(context).primaryColorLight),
          child: Padding(
              padding: EdgeInsets.all(15.0),
              child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      S.of(context).itsOrdered,
                      style: TextStyle(fontSize: 16, color: Theme.of(context).accentColor),
                    ),
                    SizedBox(height: 5),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: <Widget>[
                        Text(
                          S.of(context).orderNo,
                          style: TextStyle(fontSize: 14, color: Theme.of(context).accentColor),
                        ),
                        SizedBox(width: 5),
                        Expanded(
                          child: Text(
                            "#${order.number}",
                            style: TextStyle(fontSize: 14, color: Theme.of(context).accentColor),
                          ),
                        )
                      ],
                    )
                  ])),
        ),
        SizedBox(height: 30),
        Text(S.of(context).orderSuccessTitle1,
            style: TextStyle(fontSize: 18, color: Theme.of(context).accentColor)),
        SizedBox(height: 15),
        Text(
          S.of(context).orderSuccessMsg1,
          style: TextStyle(color: Theme.of(context).accentColor, height: 1.4, fontSize: 14),
        ),
        if (userModel.user != null)
          Padding(
            padding: EdgeInsets.symmetric(vertical: 30),
            child: Row(children: [
              Expanded(
                child: ButtonTheme(
                  height: 45,
                  child: RaisedButton(
                    color: Theme.of(context).primaryColor,
                    textColor: Colors.white,
                    onPressed: () {
                      Navigator.of(context).pushNamed("/orders");
                    },
                    child: Text(
                      S.of(context).showAllMyOrdered.toUpperCase(),
                    ),
                  ),
                ),
              ),
            ]),
          ),
        SizedBox(height: 40),
        Text(
          S.of(context).orderSuccessTitle2,
          style: TextStyle(fontSize: 18, color: Theme.of(context).accentColor),
        ),
        SizedBox(height: 10),
        Text(
          S.of(context).orderSuccessMsg2,
          style: TextStyle(color: Theme.of(context).accentColor, height: 1.4, fontSize: 14),
        ),
        Padding(
          padding: EdgeInsets.symmetric(vertical: 30),
          child: Row(children: [
            Expanded(
                child: ButtonTheme(
              height: 45,
              child: OutlineButton(
                  borderSide: BorderSide(color: Theme.of(context).accentColor),
                  child: new Text(S.of(context).backToShop.toUpperCase()),
                  onPressed: () {
                    Navigator.of(context).pushNamed("/home");
                  },
                  shape: RoundedRectangleBorder()),
            )),
          ]),
        )
      ],
    );
  }
}
