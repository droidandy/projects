/**
 * Created by developercomputer on 29.02.16.
 */
import React, { Component } from "react";

export default class Splash extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hidden: false
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ hidden: true });
    }, 3000);
  }


  render() {
    const { hidden } = this.state;
    const classList = hidden ? "splash hidden" : "splash";
    return (
        <div className={classList}></div>
    );
  }
}
