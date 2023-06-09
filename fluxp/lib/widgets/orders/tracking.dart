import 'package:flutter/material.dart';
import '../../common/constants.dart';
import '../../common/tools.dart';
import 'package:intl/intl.dart' as intl;

enum StatusOrder {
  pendding,
  onHold,
  failed,
  cancelled,
  processing,
  completed,
  refunded
}

class TimelineTracking extends StatefulWidget {
  final Axis axisTimeLine;
  final String status;
  final DateTime createdAt;
  final DateTime dateModified;

  TimelineTracking(
      {Key key,
      this.axisTimeLine = Axis.vertical,
      this.status,
      this.createdAt,
      this.dateModified})
      : super(key: key);
  @override
  _TimelineTrackingState createState() => _TimelineTrackingState();
}

class _TimelineTrackingState extends State<TimelineTracking> {
  var statusOrderSuccessNotFail = [
    StatusOrder.pendding,
    StatusOrder.onHold,
    StatusOrder.processing,
    StatusOrder.completed
  ];

  var statusOrderSuccessIsFail = [
    StatusOrder.pendding,
    StatusOrder.failed,
    StatusOrder.processing,
    StatusOrder.completed
  ];

  var statusOrderSuccessRefunded = [
    StatusOrder.pendding,
    StatusOrder.onHold,
    StatusOrder.processing,
    StatusOrder.completed,
    StatusOrder.refunded
  ];

  var statusOrderCancel = [
    StatusOrder.pendding,
    StatusOrder.failed,
    StatusOrder.cancelled
  ];

  get isAxisVertical => widget.axisTimeLine == Axis.vertical;

  @override
  Widget build(BuildContext context) {
    Widget renderMain;
    if (isAxisVertical) {
      renderMain = Column(children: _renderStatus(widget.status));
    } else {
      renderMain = Row(children: _renderStatus(widget.status));
    }

    return Center(
      child: Container(
          width: MediaQuery.of(context).size.width * 0.8,
          child: SingleChildScrollView(
            child: renderMain,
            scrollDirection: isAxisVertical ? Axis.vertical : Axis.horizontal,
          )),
    );
  }

  String converTime(datetime) {
    return intl.DateFormat.yMMMd()
        .format(datetime.toLocal())
        .replaceAll(', ', '.');
  }

  Widget _renderItem(
      {int index,
      DateTime time,
      String title,
      String description,
      StatusOrder status,
      StatusOrder statusCurrent,
      bool isActive,
      bool showLine = true}) {
    Widget date = SizedBox(
      width: isAxisVertical ? MediaQuery.of(context).size.width * 0.2 : null,
      height: 25.0,
      child: Align(
        alignment: Alignment.centerLeft,
        child: Text(
          time != null ? converTime(time) : "",
          textAlign: TextAlign.end,
        ),
      ),
    );

    List<Widget> contentInLine = [
      Padding(
        padding: EdgeInsets.symmetric(horizontal: 5.0),
        child: Center(
          child: Container(
            width: 25,
            height: 25,
            decoration: BoxDecoration(
                color: isActive ? Theme.of(context).primaryColor : Colors.grey,
                borderRadius: BorderRadius.circular(20)),
            child: Center(
              child: Text(
                "${index + 1}",
                style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: isActive
                        ? Colors.white
                        : Theme.of(context).accentColor),
              ),
            ),
          ),
        ),
      ),
      showLine
          ? _buildLine(true, isActive && status != statusCurrent)
          : SizedBox()
    ];

    Widget content = SizedBox(
        width: MediaQuery.of(context).size.width * 0.5,
        height: description.isEmpty ? 25.0 : null,
        child: Align(
          alignment: Alignment.centerLeft,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Text(title),
              description.isEmpty
                  ? Container(
                      width: 0.0,
                      height: 0.0,
                    )
                  : Text(
                      description,
                      style: TextStyle(fontSize: 10),
                    )
            ],
          ),
        ));

    if (isAxisVertical) {
      return Row(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          date,
          Container(child: Column(children: contentInLine)),
          content
        ],
      );
    } else {
      return Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Container(
            width: 120,
            child: content,
          ),
          Container(
              margin: EdgeInsets.symmetric(vertical: 10),
              child: Row(children: contentInLine)),
          date
        ],
      );
    }
  }

  Widget _buildLine(bool visible, bool isActive) {
    return Container(
      width: isAxisVertical ? (visible ? 2.0 : 0.0) : double.infinity,
      height: isAxisVertical ? 60 : (visible ? 2.0 : 0.0),
      color: isActive ? Theme.of(context).primaryColor : Colors.grey.shade400,
    );
  }

  List<Widget> _renderStatus(String _status) {
    List<Widget> listStatus = List();
    StatusOrder statusOrder;
    List<StatusOrder> flowHandleStatus = statusOrderSuccessNotFail;

    switch (_status) {
      case "on-hold": //Thể hiện timeline : Pendding(active) -> On-Hold(active) -> Processing -> Completed
        statusOrder = StatusOrder.onHold;
        flowHandleStatus = statusOrderSuccessNotFail;
        break;
      case "pendding": //Thể hiện timeline : Pendding(active) -> On-Hold -> Processing -> Completed
        statusOrder = StatusOrder.pendding;
        flowHandleStatus = statusOrderSuccessNotFail;
        break;
      case "processing": //Thể hiện timeline : Pendding(active) -> On-Hold(active) -> Processing(active) -> Completed
        statusOrder = StatusOrder.processing;
        flowHandleStatus = statusOrderSuccessNotFail;
        break;
      case "cancelled": //Thể hiện timeline : Pendding(active) -> Failed(active) -> Cancelled(active)
        statusOrder = StatusOrder.cancelled;
        flowHandleStatus = statusOrderCancel;
        break;
      case "refunded": //Thể hiện timeline : Pendding(active) -> On-Hold(active) -> Processing(active) -> Completed(active) -> Refunded(active)
        statusOrder = StatusOrder.refunded;
        flowHandleStatus = statusOrderSuccessRefunded;
        break;

      case "completed": //Thể hiện timeline : Pendding(active) -> On-Hold(active) -> Processing(active) -> Completed(active)
        statusOrder = StatusOrder.completed;
        flowHandleStatus = statusOrderSuccessNotFail;
        break;

      case "failed": //Thể hiện timeline : Pendding(active) -> Failed(active) -> Processing -> Completed
        statusOrder = StatusOrder.failed;
        flowHandleStatus = statusOrderSuccessIsFail;
        break;
      default:
        statusOrder = StatusOrder.pendding;
        flowHandleStatus = statusOrderSuccessNotFail;
    }

    for (var i = 0; i < flowHandleStatus.length; i++) {
      listStatus.add(_renderItem(
          index: i,
          statusCurrent: statusOrder,
          isActive: i <= flowHandleStatus.indexOf(statusOrder),
          title: getTitleStatus(flowHandleStatus[i]),
          showLine: i < (flowHandleStatus.length - 1),
          status: flowHandleStatus[i],
          time: i == 0
              ? widget.createdAt
              : (i == flowHandleStatus.indexOf(statusOrder)
                  ? widget.dateModified
                  : null),
          description: ""));
    }
    return listStatus;
  }

  Color getColor(StatusOrder status) {
    switch (status) {
      case StatusOrder.onHold:
        return HexColor(kOrderStatusColor["on-hold"]);
      case StatusOrder.pendding:
        return HexColor(kOrderStatusColor["pendding"]);
      case StatusOrder.failed:
        return HexColor(kOrderStatusColor["failed"]);
      case StatusOrder.completed:
        return HexColor(kOrderStatusColor["completed"]);
      case StatusOrder.cancelled:
        return HexColor(kOrderStatusColor["cancelled"]);
      case StatusOrder.refunded:
        return HexColor(kOrderStatusColor["refunded"]);
      case StatusOrder.processing:
        return HexColor(kOrderStatusColor["processing"]);
      default:
        return Colors.white;
    }
  }

  String getTitleStatus(StatusOrder status) {
    switch (status) {
      case StatusOrder.onHold:
        return "On-hold";
      case StatusOrder.pendding:
        return "Pending payment ";
      case StatusOrder.failed:
        return "Failed";
      case StatusOrder.processing:
        return "Processing";
      case StatusOrder.completed:
        return "Completed";
      case StatusOrder.cancelled:
        return "Cancelled";
      case StatusOrder.refunded:
        return "Refunded";
      default:
        return "";
    }
  }
}
