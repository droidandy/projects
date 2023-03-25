/**
 * Created by developercomputer on 17.11.15.
 */
var React = require("react");

class Link extends React.Component {
  handleClick() {
    cordova.InAppBrowser.open(this.props.href, this.props.target, 'location=no');
  }
  render() {
    var props = this.props;
    return (
        <a className={props.className}
           href="#"
           onClick={this.handleClick.bind(this)}
           style={props.style}
            >
          {props.text || props.children}
        </a>
    );
  }
}

Link.propTypes = {
  className: React.PropTypes.string,
  href: React.PropTypes.string,
  target: React.PropTypes.string,
  text: React.PropTypes.string,
  style: React.PropTypes.object
};

Link.defaultProps = {
  className: "button button-big color-red",
  href: "#",
  target: "_system",
  text: "",
  style: {}
};

module.exports = Link;
