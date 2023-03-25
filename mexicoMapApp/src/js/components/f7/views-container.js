/**
 * Created by developercomputer on 11.12.15.
 */
import React from "react"

class ViewsContainer extends React.Component {
  render() {
    return (
        <div className="views">{this.props.children}</div>
    );
  }
}

export default ViewsContainer;
