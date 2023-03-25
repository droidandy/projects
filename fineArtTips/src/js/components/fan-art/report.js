/**
 * Created by developercomputer on 24.11.15.
 */
var React = require("react"),
    app = require("./../../f7init/f7init"),
    Store = require("./../../stores/store"),
    words = require("./../../words");

function checkAuthorizationStatus() {
  var isAuthorized = window.Parse ? Parse.User.current() : null;
  if(isAuthorized == null) {
    return false;
  }
  return true;
}
/*
 * Report reasons:
 *
 * 1: This account might be compromised or hacked
 * 2: Violence or harmful content
 * 3: Sexually explicit content
 * 4: Another violation of the guidelines
 *
 * */
const REASONS = {
  1: words.fanArt_report_1[LN],
  2: words.fanArt_report_2[LN],
  3: words.fanArt_report_3[LN],
  4: words.fanArt_report_4[LN]
};

class Reporter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      didUserReport: false,
      isAuthorized: checkAuthorizationStatus()
    };
    this.fetchReports = this.fetchReports.bind(this);
    this.clearState = this.clearState.bind(this);
    this.setAuthorized = this.setAuthorized.bind(this);
    this.setUnauthorized = this.setUnauthorized.bind(this);
    this.initialFetch = this.initialFetch.bind(this);
    this.callActionSheet = this.callActionSheet.bind(this);
  }

  componentDidMount() {
    this.fetchReports();
    Store.bind("authorization", this.setAuthorized);
    Store.bind("unauthorize", this.setUnauthorized);
    Store.bind("fetchFanArtDetails", this.initialFetch);
  }

  initialFetch() {
    this.clearState();
    this.fetchReports();
  }

  setAuthorized() {
    this.setState({
      isAuthorized: true
    });
    this.fetchReports();
  }

  setUnauthorized() {
    this.setState({
      isAuthorized: false
    });
  }


  clearState() {
    this.setState({
      didUserReport: false
    });
  }

  fetchReports() {
    if(window.Parse) {
      var ReportFanArt = Parse.Object.extend("ReportFanArt");
      var query = new Parse.Query(ReportFanArt);
      query.equalTo("fanArtId", Store.currentFanArtId);
      query.find({
        success: results => {
          var usersReport = [];
          if(this.state.isAuthorized) {
            usersReport = results.filter(item => item.toJSON().owner_username.objectId === Store.user.toJSON().objectId);
          }
          this.setState({
            didUserReport: usersReport.length !== 0
          });
        },
        error: error => {
          this.clearState();
          console.log("Error: " + error.code + " " + error.message);
        }
      });
    }
  }

  sendReport(reason) {
    this.setState({ didUserReport: true });
    var ReportFanArt = Parse.Object.extend("ReportFanArt");
    var reportFanArt = new ReportFanArt();
    reportFanArt.set("fanArtId", Store.currentFanArtId);
    reportFanArt.set("owner_username", Parse.User.current());
    reportFanArt.set("reason", REASONS[reason]);
    reportFanArt.save(null, {
      success: report => {
        // Execute any logic that should take place after the object is saved.
        console.log('New object created with objectId: ' + report.id);
        this.fetchReports();
      },
      error(report, error) {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and message.
        console.log(error);
        console.log('Failed to create new object, with error code: ' + error.message);
        this.setState({ didUserReport: false });
      }
    });
  }

  _renderUnAuthorized() {
    return (
        <div className="actionsPanel--button report disabled"/>
    );
  }

  callActionSheet() {
    var buttons1 = [
      {
        text: words.fanArt_chooseReason[LN],
        label: true
      },
      {
        text: REASONS[1],
        onClick: () => this.sendReport(1)
      },
      {
        text: REASONS[2],
        onClick: () => this.sendReport(2)
      },
      {
        text: REASONS[3],
        onClick: () => this.sendReport(3)
      },
      {
        text: REASONS[4],
        onClick: () => this.sendReport(4)
      }
    ];
    var buttons2 = [
      {
        text: words.cancel[LN],
        color: 'red'
      }
    ];
    var groups = [buttons1, buttons2];
    app.f7.actions(groups);
  }

  _renderAuthorized() {
    var tapHandler = this.state.didUserReport ? () => console.log("report was done already") : this.callActionSheet;
    var classNames = this.state.didUserReport ? "actionsPanel--button report disabled" : "actionsPanel--button report";
    return (
        <div className={classNames}
             onClick={tapHandler}
            >
          <div className="text">{words.fanArt_reportLabel[LN]}</div>
        </div>
    );
  }

  render() {
    return this.state.isAuthorized ? this._renderAuthorized() : this._renderUnAuthorized();
  }
}

module.exports = Reporter;
