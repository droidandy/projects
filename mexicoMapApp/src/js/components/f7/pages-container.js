/**
 * Created by developercomputer on 11.12.15.
 */
import React from "react"

class PagesContainer extends React.Component {
  render() {
    return (
        <div className={`pages ${this.props.mode}`}>{this.props.children}</div>
    );
  }
}

export default PagesContainer;
