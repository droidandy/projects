import 'package:after_layout/after_layout.dart';
import 'package:flutter/material.dart';
import '../../../tabbar.dart';

import '../../../common/tools.dart';
import '../../../models/product.dart';
import '../../../screens/detail/index.dart';
import '../../../services/index.dart';
import 'package:webview_flutter/webview_flutter.dart';

/// The Banner type to display the image
class BannerImageItem extends StatefulWidget {
  final Key key;
  final config;
  final double width;
  final padding;
  final BoxFit boxFit;
  final radius;

  BannerImageItem(
      {this.key,
      this.config,
      this.padding,
      this.width,
      this.boxFit,
      this.radius})
      : super(key: key);

  @override
  _BannerImageItemState createState() => _BannerImageItemState();
}

class _BannerImageItemState extends State<BannerImageItem>
    with AfterLayoutMixin {
  Product _product;

  List<Product> _products;

  Services _service = Services();

  @override
  void afterFirstLayout(BuildContext context) {
    /// for pre-load the product detail
    if (widget.config["product"] != null) {
      _service.getProduct(widget.config["product"]).then(
        (product) {
          if (!mounted) return;
          setState(() {
            _product = product;
          });
        },
      );
    }

    /// for pre-load the list product
    if (widget.config['data'] != null) {
      print(widget.config['data']);
      _products = widget.config['data'];
    }
  }

  _onTap(context) {
    /// support to show the product detail
    if (widget.config["product"] != null && _product != null) {
      return Navigator.push(
          context,
          MaterialPageRoute<void>(
            builder: (BuildContext context) => Detail(product: _product),
            fullscreenDialog: true,
          ));
    }
    if(widget.config["tab"] != null){
      return MainTabs.keyNavigationTabbar
          .currentState
            .changeTab(widget.config["tab"]);
    }
    if(widget.config["screen"] != null){
      return Navigator.of(context).pushNamed(widget.config["screen"]);
    }
    /// support to show the post detail
    if (widget.config["url"] != null) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => Scaffold(
            appBar: AppBar(
              backgroundColor: Theme.of(context).primaryColorLight,
              leading: GestureDetector(
                child: Icon(Icons.arrow_back_ios),
                onTap: () => Navigator.pop(context),
              ),
            ),
            body: WebView(
              initialUrl: widget.config["url"],
              javascriptMode: JavascriptMode.unrestricted,
            ),
          ),
        ),
      );
    } else {
      /// Default navigate to show the list products
      Product.showList(
          context: context, config: widget.config, products: _products);
    }
  }

  @override
  Widget build(BuildContext context) {
    double _padding = Tools.formatDouble(widget.config["padding"] ?? widget.padding ?? 10.0);
    double _radius = Tools.formatDouble(widget.config['radius'] ??
        (widget.radius != null ? widget.radius : 0.0));

    final screenSize = MediaQuery.of(context).size;
    final itemWidth = widget.width ?? screenSize.width;

    return GestureDetector(
      onTap: () => _onTap(context),
      child: Container(
        width: itemWidth,
        child: Padding(
            padding: EdgeInsets.only(left: _padding, right: _padding),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(_radius),
              child: Tools.image(
                fit: this.widget.boxFit ?? BoxFit.fitWidth,
                url: widget.config["image"],
              ),
            )),
      ),
    );
  }
}
