/**
 * Created by developercomputer on 29.10.15.
 */
var React = require("react"),
    Blog = require("./../../components/blog/blog");

class BlogsPage extends React.Component {
  render() {
    return (
        <div className="page-content">
          <Blog/>
        </div>
    );
  }
}

module.exports = BlogsPage;