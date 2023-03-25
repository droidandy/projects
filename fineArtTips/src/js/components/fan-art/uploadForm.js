/**
 * Created by developercomputer on 09.11.15.
 */
var React = require("react"),
    Store = require("./../../stores/store"),
    flickr = require("./../../api/flickr"),
    app = require("./../../f7init/f7init"),
    words = require("./../../words");

class UploadForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      photo: ""
    };
    this.setPhoto = this.setPhoto.bind(this);
    this.postPhoto = this.postPhoto.bind(this);
  }

  componentDidMount() {
    Store.bind("pickPhoto", this.setPhoto);
  }

  setPhoto() {
    this.setState({ photo: Store.photo_url });
  }

  postPhoto() {
    var titleRef = this.refs.title,
        descRef = this.refs.desc;
    var data = {
      photo: Store.photo_url,
      title: titleRef.value,
      description: descRef.value
    };
    app.f7.showIndicator();
    var file = new Parse.File("image", { base64: data.photo });
    var userInfo = Store.user.toJSON();
    var FanArt = Parse.Object.extend("FanArt");
    var fanArt = new FanArt();
    fanArt.set("photo", file);
    fanArt.set("title", data.title);
    fanArt.set("description", data.description);
    fanArt.set("username", userInfo.username);
    fanArt.set("realname", `${userInfo.first_name} ${userInfo.second_name}`);
    fanArt.set("avatar", userInfo.avatar.url);
    fanArt.save(null, {
      success(fan) {
        // Execute any logic that should take place after the object is saved.
        console.log('New object created with objectId: ' + fan.id);
        app.f7.hideIndicator();
        titleRef.value = "";
        descRef.value = "";
        app.mainView.router.back()
      },
      error(fan, error) {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and message.
        app.f7.hideIndicator();
        console.log(error);
        console.log('Failed to create new object, with error code: ' + error.message);
      }
    });
  }

  render() {
    return (
        <div className="upload-form">
          <div className="upload-photo" style={{backgroundImage: `url("${this.state.photo}")`}}></div>
          <div className="list-block">
            <ul>
              <li>
                <div className="item-content">
                  <div className="item-inner">
                    <div className="item-title label">{words.title[LN]}</div>
                    <div className="item-input">
                      <input type="text" placeholder={words.title[LN]} ref="title"/>
                    </div>
                  </div>
                </div>
              </li>
              <li className="align-top">
                <div className="item-content">
                  <div className="item-inner">
                    <div className="item-title label">{words.description[LN]}</div>
                    <div className="item-input">
                      <textarea ref="desc"/>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <p>
            <a href="#"
               className="button color-red"
               onClick={this.postPhoto}
               style={{width: "80%", margin: "20px auto"}}
              >
              {words.upload_image[LN]}
            </a>
          </p>
        </div>
    );
  }
}

module.exports = UploadForm;