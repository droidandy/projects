import 'package:flutter/material.dart';
import '../common/config.dart';

import '../generated/i18n.dart';
import '../models/blog.dart';
import '../widgets/blog/blog_list_view.dart';
import 'package:provider/provider.dart';

class BlogScreen extends StatefulWidget {

  @override
  State<StatefulWidget> createState() {
    return BlogScreenState();
  }
}

class BlogScreenState extends State<BlogScreen>
    with SingleTickerProviderStateMixin, WidgetsBindingObserver {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: !kLayoutWeb ? AppBar(
        elevation: 0.1,
        title: Text(
          S.of(context).blog,
          style: TextStyle(color: Colors.white),
        ),
        leading: Center(
          child: GestureDetector(
            onTap: () => {Navigator.pop(context)},
            child: Icon(Icons.arrow_back_ios, color: Colors.white),
          ),
        ),
      ) : null,
      body: SafeArea(
        child: BlogListView(blogs: Provider.of<BlogModel>(context, listen: false).blogs),
      ),
    );
  }
}
