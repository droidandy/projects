import 'dart:async';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../common/constants.dart';
import '../../../generated/i18n.dart';
import '../../../models/product.dart';
import '../../../models/search.dart';
import '../../../screens/search/recent_search.dart';
import '../vertical/vertical_simple_list.dart';
import 'custom_search_page.dart';

class CustomSearch extends SearchCustomDelegate {
  @override
  List<Widget> buildActions(BuildContext context) {
    return <Widget>[
      query.isEmpty
          ? IconButton(
              tooltip: 'Clear',
              icon: const Icon(Icons.search),
              onPressed: () {},
            )
          : IconButton(
              tooltip: 'Clear',
              icon: const Icon(Icons.clear),
              onPressed: () {
                query = '';
                showSuggestions(context);
              },
            ),
    ];
  }

  @override
  Widget buildLeading(BuildContext context) {
    return IconButton(
      icon: Icon(Icons.arrow_back_ios, size: 20),
      onPressed: () {
        close(context, null);
      },
    );
  }

  Future<List<Product>> searchProduct(context, {name, page = 1}) async {
    return await Provider.of<SearchModel>(context, listen: false)
        .searchProducts(name: name, page: page);
  }

  @override
  Widget buildResults(BuildContext mainContext) {
    if (query.length < 1) {
      return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Center(
            child: Text(S.of(mainContext).searchInput),
          )
        ],
      );
    }

    return Column(
      children: <Widget>[
        StreamBuilder<List<Product>>(
          stream: Stream.fromFuture(searchProduct(mainContext, name: query)),
          builder: (context, snapshot) {
            if (!snapshot.hasData) {
              return Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    Center(
                      child: kLoadingWidget(context),
                    ),
                  ],
                ),
              );
            } else {
              FocusScopeNode currentFocus = FocusScope.of(mainContext);
              currentFocus.unfocus();
            }

            if (snapshot.data.length == 0) {
              return Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    Center(
                      child: Text(
                        S.of(context).noProduct,
                      ),
                    ),
                  ],
                ),
              );
            } else {
              var results = snapshot.data;
              return Expanded(
                child: Container(
                  color: Theme.of(context).backgroundColor,
                  child: ListView.builder(
                    itemCount: results.length,
                    itemBuilder: (context, index) {
                      var result = results[index];
                      return SimpleListView(
                        item: result,
                      );
                    },
                  ),
                ),
              );
            }
          },
        )
      ],
    );
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    FocusScopeNode currentFocus = FocusScope.of(context);
    currentFocus.requestFocus();
    return ListenableProvider.value(
      value: Provider.of<SearchModel>(context),
      child: Consumer<SearchModel>(builder: (context, model, child) {
        return Padding(
          child: RecentSearches(
            onTap: (text) {
              query = text;
              showResults(context);
            },
          ),
          padding: EdgeInsets.only(left: 10, right: 10),
        );
      }),
    );
  }
}
