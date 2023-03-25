/**
 * Created by developercomputer on 08.01.16.
 */
import React, { Component, PropTypes } from 'react';
import SVG from "./../svg.js";
import colors from "./../../content/region-colors.js";
import regions from "./../../content/regions.js";

class RegionPreview extends Component {
  render() {
    const { url, height, code } = this.props;
    const xml = require(`./../../svg/svg--id--${code}.svg`);
    const onMount = function (cont) {
      let path = cont.getElementsByTagName("path")[0];
      return path.setAttribute("fill", colors[this.code]);
    };
    const sizeIndex = regions.find(i => i.code === code).sizeIndex;
    return (
        <div className="regPrev">
          <SVG
            key={code}
            data-code={code}
            style={{width: 45*sizeIndex}}
            xml={xml}
            onMount={onMount.bind({code: code})}/>
        </div>
    );
    //return (
    //    <div className="regPrev">
    //      <img src={url} height={height} />
    //    </div>
    //);
  }
}

export default RegionPreview;
