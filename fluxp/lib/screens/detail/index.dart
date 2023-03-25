import 'package:flutter/material.dart';
import '../../common/constants.dart';
import 'package:provider/provider.dart';
import 'package:share/share.dart';

import '../../common/config.dart';
import '../../common/styles.dart';
import '../../generated/i18n.dart';
import '../../models/product.dart';
import '../../models/wishlist.dart';
import '../../widgets/image_galery.dart';
import 'themes/fullSizeImageType.dart';
import 'themes/halfSizeImageType.dart';
import 'themes/simpleType.dart';

class Detail extends StatelessWidget {
  final Product product;

  static showMenu(context, product) {
    showModalBottomSheet(
        context: context,
        builder: (BuildContext context) {
          return Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              ListTile(
                  title: Text(S.of(context).myCart, textAlign: TextAlign.center),
                  onTap: () {
                    Navigator.of(context).pop();
                  }),
              ListTile(
                  title: Text(S.of(context).showGallery, textAlign: TextAlign.center),
                  onTap: () {
                    Navigator.of(context).pop();
                    showDialog<void>(
                        context: context,
                        builder: (BuildContext context) {
                          return ImageGalery(images: product.images, index: 0);
                        });
                  }),
              ListTile(
                  title: Text(S.of(context).saveToWishList, textAlign: TextAlign.center),
                  onTap: () {
                    Provider.of<WishListModel>(context, listen: false).addToWishlist(product);
                    Navigator.of(context).pop();
                  }),
              ListTile(
                  title: Text(S.of(context).share, textAlign: TextAlign.center),
                  onTap: () {
                    Navigator.of(context).pop();
                    Share.share(product.permalink);
                  }),
              Container(
                height: 1,
                decoration: BoxDecoration(color: kGrey200),
              ),
              ListTile(
                title: Text(
                  S.of(context).cancel,
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          );
        });
  }

  Detail({this.product});

  @override
  Widget build(BuildContext context) {
    var layoutType = kProductDetail['layout'] ?? kProductLayout.simpleType;
    Widget layout;
    switch (layoutType) {
      case kProductLayout.halfSizeImageType:
        layout = HalfSizeLayout(product: product);
        break;
      case kProductLayout.fullSizeImageType:
        layout = FullSizeLayout(product: product);
        break;
      default:
        layout = SimpleLayout(product: product);
        break;
    }
    return layout;
  //   return Row(
  //     children: <Widget>[
  //       kLayoutWeb ? Container(
  //         width: 250, //  (cappedTextScale(context) - 1)
  //         alignment: Alignment.topCenter,
  //         padding: const EdgeInsets.only(bottom: 32),
  //         child: MenuBar(),
  //       ) : SizedBox(),
  //       Expanded( 
  //         child: layout,
  //       )
  //     ]
  //   );
  }
}
