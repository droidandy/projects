/**
 * Created by developercomputer on 29.10.15.
 */
var React = require("react"),
    Materials = require("./../../components/materials/materials");

class MaterialsPage extends React.Component {
  render() {
    return (
        <div className="page-content">
          <Materials/>
        </div>
    );
  }
}

module.exports = MaterialsPage;