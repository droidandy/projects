/**
 * Created by developercomputer on 13.01.16.
 */
import React, { Component, PropTypes, DefaultProps } from "react";
import Radium from "radium";

@Radium
class SVG extends Component {

  static propTypes = {
    style: PropTypes.object.isRequired,
    xml: PropTypes.string.isRequired,
    onMount: PropTypes.func
  };

  componentDidMount() {
    const { onMount } = this.props;
    if(typeof onMount !== "undefined") {
      onMount(this.refs.container);
    }
  }

  render() {
    const { style, xml } = this.props;
    return (
        <div style={style} dangerouslySetInnerHTML={{__html: xml}} ref="container"/>
    );
  }
}



export default SVG;
