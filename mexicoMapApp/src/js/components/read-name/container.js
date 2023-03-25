/**
 * Created by developercomputer on 11.01.16.
 */
import React, { Component } from "react";

import SVG from "./../svg.js";
import colors from "./../../content/region-colors.js";
import regions from "./../../content/regions.js";
import ZoomControl from "./../zoomControl.js";

class ReadName extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentCode: "",
      zoom: 1
    };
    this.onReadNameMapMount = this.onReadNameMapMount.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
  }

  zoomIn() {
    if(this.state.zoom >= 4.5) {
      return;
    }
    this.setState({ zoom: this.state.zoom + 0.5 })
  }
  zoomOut() {
    if(this.state.zoom <= 1) {
      return;
    }
    this.setState({ zoom: this.state.zoom - 0.5 })
  }

  onReadNameMapMount() {
    let regions = document.querySelectorAll(".read-name .svg-region");
    let _this = this;
    let onRegionTap = function() {
      /*
       * we do not use arrow functions here cause we need this pointer
       * in this case this will refer to element that we tapped
       * */
      let $item = Dom7(this);
      _this.setState({
        currentCode: $item.dataset().code
      });
      let { overlay, text } = _this.refs;
      overlay.classList.add("appear");
      text.classList.add("appear");
      this.classList.add("read-name-click");
      const ANIMATION_TIME = 1920;
      let self = this;
      setTimeout(() => {
        overlay.classList.remove("appear");
        text.classList.remove("appear");
        self.classList.remove("read-name-click");
      }, ANIMATION_TIME);
    };
    Array.from(regions).forEach((region) => {
      let $region = Dom7(region);
      const code = $region.dataset().code;
      $region.css({fill: colors[code]});
      $region.on("click", onRegionTap);
    });
  }

  hideOverlay() {
    let { overlay, text } = this.refs;
    text.classList.remove("appear");
    overlay.classList.remove("appear");
  }

  render() {
    const svgMap = require("./../../svg/mexico-map.svg");
    const { currentCode, zoom } = this.state;
    const regionName = regions.reduce((prev, cur) => cur.code === currentCode ? cur.name + prev : prev, "");
    return (
        <div className="container read-name">
          <div className="overlay" ref="overlay"></div>
          <div className="text" ref="text">{regionName}</div>
          <div style={{overflow: "auto", width: "100%", height: "100%"}}>
            <SVG
                style={{width: `${100*zoom}%`}}
                xml={svgMap}
                onMount={this.onReadNameMapMount}
                />
          </div>
          <ZoomControl
              zoomIn={this.zoomIn}
              zoomOut={this.zoomOut}/>
        </div>
    );
  }
}

export default ReadName;
