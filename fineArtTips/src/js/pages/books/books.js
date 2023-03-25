/**
 * Created by developercomputer on 29.10.15.
 */
var React = require("react"),
    Books = require("./../../components/books/books");

class BooksPage extends React.Component {
  render() {
    return (
        <div className="page-content white">
          <Books/>
        </div>
    );
  }
}

module.exports = BooksPage;