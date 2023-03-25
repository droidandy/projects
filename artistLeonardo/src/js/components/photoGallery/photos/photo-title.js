/**
 * Created by developercomputer on 28.10.15.
 */
var React = require("react"),
    Store = require("./../../../stores/store"),
    app = require("./../../../f7init/f7init");

class PhotoTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: ""
    };
    this.changeTitle = this.changeTitle.bind(this);
  }

  changeTitle() {
    this.setState({title: Store.photosTitle});
  }

  componentDidMount() {
    Store.bind("fetchPhotosInPhotoset", this.changeTitle);
  }

  componentDidUpdate() {
    app.f7.sizeNavbars('.view-main');
  }

  render() {
    return (
        <span>{this.state.title}</span>
    );
  }
}

module.exports = PhotoTitle;