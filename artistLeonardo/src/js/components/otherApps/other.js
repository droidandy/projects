/**
 * Created by developercomputer on 27.11.15.
 */
var React = require("react"),
    Link = require("./../link/link"),
    words = require("./../../words");
/*
 *
 * FineArtTips: Other_FAT
 * Arte Deviarte: Other_AD
 *
 * */


var NoOtherApps = () => {
  return (
      <div className="noapps content-block">
        <h1>{words.other_noApps[LN]}</h1>
        <h2>{words.other_soon[LN]}</h2>
      </div>
  );
};

class Card extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      collapsed: true
    };
    this._renderDesc = this._renderDesc.bind(this);
    this.showMore = this.showMore.bind(this);
    this.showLess = this.showLess.bind(this);
  }

  showMore() {
    this.setState({collapsed: false});
  }

  showLess() {
    this.setState({collapsed: true});
  }

  _renderDesc(desc) {
    let btnText = this.state.collapsed ? words.read_more[LN] : words.hide[LN],
        callback = this.state.collapsed ? this.showMore : this.showLess,
        style = {
          height: this.state.collapsed ? "78px" : "auto",
          overflow: this.state.collapsed ? "hidden" : ""
        };
    return (
        <div className="info--text">
          <div dangerouslySetInnerHTML={{__html: desc}} style={style}/>
          <br/>
          <a href="#" onClick={callback}>{btnText}</a>
        </div>
    );
  }

  render() {
    const { app_name, app_icon, app_desc, app_langs, url, platform } = this.props;
    const linkText = platform === "ios" ? words.viewOnAppStore[LN] : words.viewOnGooglePlay[LN];
    console.log("Got as a prop: ", platform);
    return (
        <div className="other--card">
          <div className="other--card--title">{app_name}</div>
          <div className="other--card--cont">
            <div className="icon">
              <div className="cont" style={{backgroundImage: `url(${app_icon})`}}/>
            </div>
            <div className="info">
              <div className="info--title">{words.description[LN]}:</div>
              {this._renderDesc(app_desc)}
              <div className="info--title">{words.langs[LN]}:</div>
              <div className="info--text">{app_langs}</div>
              <Link
                  href={url}
                  text={linkText}
                  className="button button-big"
                  style={{width: "92%", margin: "20px auto", fontSize: "12px"}}
                  />
            </div>
          </div>
        </div>
    );
  }

}


class OtherApps extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
    this.fetchOtherApps = this.fetchOtherApps.bind(this);
  }

  componentDidMount() {
    try {
      this.fetchOtherApps();
    } catch(e) {
      console.log(e);
    }
  }

  fetchOtherApps() {
    let ClassName = window.FREE ? "Other_AL_free" : "Other_AL";
    var Other_AD = Parse.Object.extend(ClassName);
    var query = new Parse.Query(Other_AD);
    query.find({
      success: others => {
        // The object was retrieved successfully.
        this.setState({
          items: others.map(item => item.toJSON())
        });
      },
      error: (others, error) => {
        // The object was not retrieved successfully.
        // error is a Parse.Error with an error code and message.
        console.log(error);
        this.setState({
          items: []
        });
      }
    });
  }

  _renderOthers() {
    if(this.state.items.length === 0) {
      return <NoOtherApps/>;
    }
    const { platform } = this.props;
    console.log("Give as a prop: ", platform);
    return this.state.items.map((item, i) => {
      /*
       * app_desc: "Lorem"
       * app_icon: ""
       * app_langs: "Spanish"
       * app_name: "Arte Deviarte"
       * createdAt: "2015-11-27T07:17:28.689Z"
       * objectId: "ayFK5tEH3g"
       * updatedAt: "2015-11-27T07:17:28.689Z"
       * url: "#"
       */
      return (
          <Card
              key={i}
              app_name={item.app_name}
              app_icon={item.app_icon}
              app_desc={item.app_desc}
              app_langs={item.app_langs}
              url={item[`url_${platform}`]}
              platform={platform}
              />
      );
    });
  }

  render() {
    return (
        <div className="other">
          <div className="other--head">
            <div className="other--head--title">{words.checkOtherApps[LN]}</div>
            <div className="other--head--arrow"/>
          </div>
          {this._renderOthers()}
        </div>
    );
  }
}

module.exports = OtherApps;
