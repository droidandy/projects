import 'package:flutter/material.dart';
import 'dart:convert';
import '../../models/product.dart';
import '../../common/config.dart';
import 'package:http/http.dart' as http;

class ProductBooking extends StatefulWidget {
  final Product product;

  ProductBooking(this.product);

  @override
  _StateProductBooking createState() => _StateProductBooking();
}

class _StateProductBooking extends State<ProductBooking> {
  String durationUnit;
  int duration;
  int minDuration;
  int maxDuration;
  DateTime minDate;
  DateTime maxDate;
  DateTime bookingDate;
  String bookingDuration;
  String price;

  @override
  void initState() {
    super.initState();
    getBookingData();
  }

  DateTime supportDate(String unit, int value) {
    var _now = DateTime.now();
    var _milliSecond = _now.millisecondsSinceEpoch;
    Duration _duration;
    switch (unit) {
      case 'day':
        {
          _duration = Duration(days: value);
          break;
        }
      case 'month':
        {
          _duration = Duration(days: value * 30);
          break;
        }
      case 'year':
        {
          _duration = Duration(days: value * 30 * 12);
          break;
        }
      default:
        _duration = Duration(days: value);
    }
    return DateTime.fromMillisecondsSinceEpoch(
        _milliSecond + _duration.inMilliseconds);
  }

  Future<void> getBookingData() async {
    var response = await http.get(
        '${serverConfig['url']}/wp-json/wc-bookings/v1/products/${widget.product.id}');
    var body = jsonDecode(response.body);
    setState(() {
      durationUnit = body['duration_unit'];
      duration = body['duration'];
      minDuration = body['min_duration'];
      maxDuration = body['max_duration'];
      minDate = supportDate(body['min_date_unit'], body['min_date_value']);
      bookingDate = supportDate(body['min_date_unit'], body['min_date_value']);
      maxDate = supportDate(body['max_date_unit'], body['max_date_value']);
    });
  }

  void datePicker() async {
    final _date = await showDatePicker(
        context: context,
        initialDate: minDate,
        firstDate: minDate,
        lastDate: maxDate);
    if (_date != null && _date != bookingDate)
      setState(() {
        bookingDate = _date;
      });
    checkField();
  }

  Future<bool> checkField() async {
    var response = await http
        .post('${serverConfig['url']}/wp-admin/admin-ajax.php', headers: {
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    }, body: {
      'action': 'wc_bookings_calculate_costs',
      'form':
          'wc_bookings_field_duration=$bookingDuration&wc_bookings_field_start_date_month=${bookingDate.month}&wc_bookings_field_start_date_day=${bookingDate.day}&wc_bookings_field_start_date_year=${bookingDate.year}&add-to-cart=${widget.product.id}'
    });
    var body = jsonDecode(response.body);
    setState(() {
      price = body['html'];
    });
//    if (body['result'] == 'SUCCESS') setState(() {
//      price = body['html'];
//    });
    return true;
  }

  @override
  Widget build(BuildContext context) {
    if (minDate == null) return Container();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Container(
          height: 60,
          child: Row(
            children: <Widget>[
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      'Date booking',
                      style:
                          TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                    ),
                    SizedBox(
                      height: 2,
                    ),
                    Expanded(
                      child: GestureDetector(
                        onTap: () => datePicker(),
                        child: Container(
                          padding:
                              EdgeInsets.symmetric(horizontal: 5, vertical: 5),
                          decoration: BoxDecoration(
                              border: Border.all(
                                color: Theme.of(context).accentColor,
                                width: 0.1,
                              ),
                              borderRadius: BorderRadius.circular(2)),
                          child: Align(
                            alignment: Alignment.bottomLeft,
                            child: Text(
                              bookingDate.toString(),
                              style: TextStyle(fontSize: 16),
                            ),
                          ),
                        ),
                      ),
                    )
                  ],
                ),
              ),
              SizedBox(
                width: 30,
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text('Duration',
                      style:
                          TextStyle(fontSize: 16, fontWeight: FontWeight.w500)),
                  SizedBox(
                    height: 2,
                  ),
                  Expanded(
                    child: Container(
                      width: 100,
                      padding: EdgeInsets.symmetric(horizontal: 5, vertical: 5),
                      decoration: BoxDecoration(
                          border: Border.all(
                            color: Theme.of(context).accentColor,
                            width: 0.1,
                          ),
                          borderRadius: BorderRadius.circular(2)),
                      child: TextField(
                        onSubmitted: (text) {
                          setState(() {
                            bookingDuration = text;
                          });
                          checkField();
                        },
                        keyboardType: TextInputType.number,
                        style: TextStyle(fontSize: 16),
                        decoration: InputDecoration(border: InputBorder.none),
                      ),
                    ),
                  )
                ],
              ),
            ],
          ),
        ),
        SizedBox(
          height: 10,
        ),
        Text(price ?? '')
      ],
    );
  }
}
