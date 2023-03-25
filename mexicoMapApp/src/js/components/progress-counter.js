/**
 * Created by developercomputer on 27.01.16.
 */
import React, { Component, PropTypes } from "react";

export default class ProgressCounter extends Component {

  static propTypes = {
    maxNum: PropTypes.number.isRequired,
    curNum: PropTypes.number,
    containerClass: PropTypes.string,
    textClass: PropTypes.string
  };

  render() {
    const { maxNum, curNum, containerClass, textClass } = this.props;
    return (
        <div className={containerClass}>
          <span className={textClass}>{curNum}/{maxNum}</span>
        </div>
    );
  }
}
