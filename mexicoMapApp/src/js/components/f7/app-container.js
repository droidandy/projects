/**
 * Created by developercomputer on 11.12.15.
 */
import React from "react"

class AppContainer extends React.Component {
  render() {
    return (
        <div style={{width: "100%", height: "100%"}}>{this.props.children}</div>
    );
  }
}

export default AppContainer;
