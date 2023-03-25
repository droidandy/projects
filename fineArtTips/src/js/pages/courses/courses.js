/**
 * Created by developercomputer on 29.10.15.
 */
var React = require("react"),
    Courses = require("./../../components/courses/courses");

class CoursesPage extends React.Component {
  render() {
    return (
        <div className="page-content white">
          <Courses/>
        </div>
    );
  }
}

module.exports = CoursesPage;