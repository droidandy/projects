/**
 * Created by developercomputer on 29.10.15.
 */
var React = require("react"),
    app = require("./../../f7init/f7init"),
    Store = require("./../../stores/store"),
    Authorizator = require("./authorizator"),
    FanArt = require("./fan-art-list"),
    FanArtMy = require("./fan-art-list-my-works"),
    FanArtBest = require("./fan-art-list-best"),
    words = require("./../../words"),
    myApp = new Framework7(),
    $$ = Dom7;

class FanArtMain extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showMyUploads: !!Parse.User.current()
    };
    this.showMyUploads = this.showMyUploads.bind(this);
  }

  showMyUploads (value) {
    this.setState({
      showMyUploads: value
    });
    if (value) {
      myApp.showTab('#tab2');
    } else {
      myApp.showTab('#tab3');
      this.refs.tab_btn_3.classList.add("active");
    }
  }

  render() {
    return (
      <div className="fan-art-main">
        <Authorizator
          showMyUploads={this.showMyUploads}
          />
        <div className="subnavbar">
          {this.state.showMyUploads ?
            <div className="tabs-buttons-row buttons-row">
              <a href="#tab1"
                className="button subnavbar-button flexcenter tab-link active"><span className="button-title">{words.fanArt_all_uploads[LN]}</span></a>
              <a href="#tab2"
                className="button subnavbar-button flexcenter tab-link"><span className="button-title">{words.fanArt_my_uploads[LN]}</span></a>
              <a href="#tab3"
                className="button subnavbar-button flexcenter tab-link"><span className="button-title">{words.fanArt_best_of_week[LN]}</span></a>
            </div>
            :
            <div className="tabs-buttons-row buttons-row">
              <a href="#tab1"
                className="button subnavbar-button flexcenter tab-link active"><span className="button-title">{words.fanArt_all_uploads[LN]}</span></a>
              <a href="#tab3"
                className="button subnavbar-button flexcenter tab-link" ref="tab_btn_3"><span className="button-title">{words.fanArt_best_of_week[LN]}</span></a>
            </div>
          }
        </div>
        <div className="tabs-swipeable-wrap">
          <div className="tabs">
            <div id="tab1" className="tab active">
              <div className="content-block-tab">
                <FanArt />
              </div>
            </div>
            {this.state.showMyUploads ?
              <div id="tab2" className="tab">
                <div className="content-block-tab">
                  <FanArtMy />
                </div>
              </div>
            : null}
            <div id="tab3" className="tab">
              <div className="content-block-tab">
                <FanArtBest />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = FanArtMain;
