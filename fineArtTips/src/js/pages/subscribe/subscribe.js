/**
 * Created by developercomputer on 29.10.15.
 */
var React = require("react"),
    SubscribeForm = require("./../../components/subscribe/subscribe");

class SubscribePage extends React.Component {
  render() {
    return (
        <div className="page-content white">
          <SubscribeForm/>
        </div>
    );
  }
}

module.exports = SubscribePage;
