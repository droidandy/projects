import 'dart:collection';
import 'dart:ui';

import 'package:carousel_pro/carousel_pro.dart';
import 'package:flutter/material.dart';
import '../../../common/tools.dart';
import 'package:provider/provider.dart';
import 'package:rubber/rubber.dart';

import '../../../models/cart.dart';
import '../../../screens/cart.dart';
import '../../../models/product.dart';
import '../index.dart';
import '../product_description.dart';
import '../product_title.dart';
import '../product_variant.dart';
import '../related_product.dart';

class HalfSizeLayout extends StatefulWidget {
  final Product product;

  HalfSizeLayout({this.product});

  @override
  _HalfSizeLayoutState createState() => _HalfSizeLayoutState();
}

class _HalfSizeLayoutState extends State<HalfSizeLayout> with SingleTickerProviderStateMixin {
  Map<String, String> mapAttribute = HashMap();
  RubberAnimationController _controller;
  ScrollController _scrollController = ScrollController();

  var top = 0.0;
  var opacityValue = 0.9;

  @override
  void initState() {
    _controller = RubberAnimationController(
        vsync: this,
        initialValue: 0.5,
        lowerBoundValue: AnimationControllerValue(percentage: 0.15),
        halfBoundValue: AnimationControllerValue(percentage: 0.5),
        upperBoundValue: AnimationControllerValue(percentage: 0.9),
        duration: Duration(milliseconds: 200));
    _controller.animationState.addListener(_stateListener);
    super.initState();
  }

  void _stateListener() {
    print(_controller.animationState.value);
    setState(() {
      opacityValue = _controller.animationState.value == AnimationState.collapsed ? 0.3 : 0.9;
    });
  }

  Widget _getLowerLayer() {
    final widthHeight = MediaQuery.of(context).size.height;
    final width = MediaQuery.of(context).size.width;
    var totalCart = Provider.of<CartModel>(context).totalCartQuantity;

    return Material(
      child: Stack(
        children: <Widget>[
          Positioned(
            top: 0,
            child: SizedBox(
              width: width,
              height: widthHeight,
              child: Tools.image(
                url: widget.product.imageFeature,
                fit: BoxFit.fitHeight,
                size: kSize.medium,
              ),
            ),
          ),
          //slider
          Positioned(
            top: 0,
            child: SizedBox(
              width: width,
              height: widthHeight,
              child: Carousel(
                images: [
                  Image.network(
                    widget.product.imageFeature,
                    fit: BoxFit.fitHeight,
                  ),
                  for (var i = 1; i < widget.product.images.length; i++)
                    Image.network(
                      widget.product.images[i],
                      fit: BoxFit.fitHeight,
                    ),
                ],
                autoplay: false,
                dotSize: 5.0,
                dotSpacing: 15.0,
                dotColor: Theme.of(context).backgroundColor.withOpacity(0.7),
                dotIncreasedColor: Theme.of(context).primaryColor.withOpacity(0.9),
                indicatorBgPadding: 5.0,
                dotBgColor: Colors.transparent,
                borderRadius: true,
                dotPosition: DotPosition.bottomCenter,
                dotVerticalPadding: MediaQuery.of(context).size.height * 0.16,
                boxFit: BoxFit.fitHeight,
              ),
            ),
          ),
          Positioned(
            top: 40,
            left: 20,
            child: CircleAvatar(
              backgroundColor: Colors.black.withOpacity(0.2),
              child: IconButton(
                icon: Icon(
                  Icons.close,
                  size: 18,
                ),
                onPressed: () {
                  Navigator.pop(context);
                },
              ),
            ),
          ),
          Positioned(
            top: 30,
            right: 4,
            child: IconButton(
              icon: Icon(Icons.more_vert),
              onPressed: () => Detail.showMenu(context, widget.product),
            ),
          ),

          Positioned(
            top: 30,
            right: 40,
            child: IconButton(
              icon: Icon(
                Icons.shopping_cart,
                size: 22,
              ),
              onPressed: () {
                Navigator.push(
                    context,
                    MaterialPageRoute<void>(
                      builder: (BuildContext context) => CartScreen(isModal: true),
                      fullscreenDialog: true,
                    ));
              }
            ),
          ),

          Positioned(
            top: 36,
            right: 44,
            child: Container(
              padding: EdgeInsets.symmetric(vertical: 2, horizontal: 4),
              decoration: BoxDecoration(
                color: Colors.red,
                borderRadius: BorderRadius.circular(9),
              ),
              constraints: BoxConstraints(
                minWidth: 18,
                minHeight: 18,
              ),
              child: Text(
                totalCart.toString(),
                style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600),
                textAlign: TextAlign.center,
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget _getUpperLayer() {
    final width = MediaQuery.of(context).size.width;

    return Material(
      color: Colors.transparent,
      child: Container(
        width: width,
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(color: Colors.black12, offset: Offset(0, -2), blurRadius: 20),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.all(Radius.circular(24)),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 10.0, sigmaY: 10.0),
            child: Container(
              padding: EdgeInsets.symmetric(vertical: 30, horizontal: 20),
              decoration: BoxDecoration(
                  color: Theme.of(context).backgroundColor.withOpacity(opacityValue),
                  borderRadius: BorderRadius.circular(10.0)),
              child: SingleChildScrollView(
                controller: _scrollController,
                physics: NeverScrollableScrollPhysics(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: <Widget>[
                    ProductTitle(widget.product),
                    ProductVariant(widget.product),
                    ProductDescription(widget.product),
                    RelatedProduct(widget.product),
                    SizedBox(
                      height: 100,
                    )
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return RubberBottomSheet(
      lowerLayer: _getLowerLayer(),
      upperLayer: _getUpperLayer(),
      animationController: _controller,
      scrollController: _scrollController,
    );
  }
}
