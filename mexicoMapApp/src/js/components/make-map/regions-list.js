/**
 * Created by developercomputer on 08.01.16.
 */
import React, { Component } from "react";
import ReactDOM from "react-dom";
import DraggableRegion from "./draggable-region.js";
import SVG from "./../svg.js";
import colors from "./../../content/region-colors.js";
import regions from "./../../content/regions.js";

class RegionsList extends Component {

  _renderRegions(data = [], type = "make-map") {
    return data.map(item => {
      const itemCopy = item.toJS();
      switch (type) {
        case "make-map":
          if(itemCopy.done_make_map) return null;
          break;
        case "put-names":
          if(itemCopy.done_put_names) return null;
          break;
        default:
          break;
      }
      if(itemCopy.done) {
        return null;
      }

      let content;
      switch (type) {
        case "make-map":
          //content = <img src={`img/svg--id--${itemCopy.code}.svg`} alt="" height="60"/>;
          const xml = require(`./../../svg/svg--id--${itemCopy.code}.svg`);
          const onMount = function (cont) {
            let path = cont.getElementsByTagName("path")[0];
            return path.setAttribute("fill", colors[this.code]);
          };
          const sizeIndex = regions.find(i => i.code === itemCopy.code).sizeIndex;
          content = (<SVG
              key={itemCopy.code}
              data-code={itemCopy.code}
              style={{width: 45*sizeIndex}}
              xml={xml}
              onMount={onMount.bind({code: itemCopy.code})}/>);
          break;
        case "put-names":
          content = (
              <div className="putNames-el">{itemCopy.text}</div>
          );
          break;
        default:
          break;
      }

      return (
          <DraggableRegion
              key={itemCopy.id}
              id={itemCopy.id}
              {...itemCopy}>
              {content}
          </DraggableRegion>
      );
    });
  }

  render() {
    const { data, type } = this.props;
    return (
        <div className="regionsList">
          {this._renderRegions(data, type)}
        </div>
    );
  }
}

export default RegionsList;
