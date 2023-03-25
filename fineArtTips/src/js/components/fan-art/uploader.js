/**
 * Created by developercomputer on 06.11.15.
 */
var React = require("react"),
    app = require("./../../f7init/f7init"),
    Store = require("./../../stores/store");

class Uploader extends React.Component {

  constructor(props) {
    super(props);
    this.upload = this.upload.bind(this);
  }

  upload() {
    navigator.camera.getPicture(b64 => {
      Store.pickPhoto(`data:image/jpeg;base64,${b64}`);
      app.mainView.loadPage("#fan-art-upload");
    }, err => console.log(err), {
      quality: 50,
      targetWidth: 600,
      targetHeight: 600,
      destinationType: navigator.camera.DestinationType.DATA_URL,
      sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
    });
  }

  render() {
    return (
        <div
            className="upload"
            onClick={this.upload}
            />
    );
  }
}

module.exports = Uploader;