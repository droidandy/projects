/**
 * Created by developercomputer on 27.10.15.
 */
var React = require("react"),
    Store = require("./../../../stores/store"),
    app = require("./../../../f7init/f7init");

class TutorialTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: ""
    };
    this.changeTitle = this.changeTitle.bind(this);
  }

  changeTitle() {
    this.setState({title: Store.tutorialsTitle});
  }

  componentDidMount() {
    Store.bind("fetchVideos", this.changeTitle);
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

module.exports = TutorialTitle;