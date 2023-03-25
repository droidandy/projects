/**
 * Created by developercomputer on 06.01.16.
 */
import React, { Component } from 'react';
import { DragDropContext, DropTarget } from 'react-dnd';
import TouchBackend from 'react-dnd-touch-backend';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as makeMapActions from "./../../actions/make-map-actions.js";
import _ from "lodash";

import RegionsList from "./regions-list.js";
import Map from "./map.js";
import CustomDragLayer from "./drag-layer.js";
import SVG from "./../svg.js";
import Tappable from 'react-tappable';
import ZoomControl from "./../zoomControl.js";
import ProgressCounter from "./../progress-counter.js";

import colors from "./../../content/region-colors.js";
import regions from "./../../content/regions";

import { f7, mainView } from "./../../f7init.js";

import { words, LN } from "./../../words.js";

var chosenRegion = null;
var regions_put_names = []; //it will contain regions list. Watch on onMapMount
var regions_make_map = [];
var audioWin, audioCorrect, audioIncorrect;

var error = {
  counter: 0,
  code: ""
};
var score = 0;



function helpUser(code, type) {
  const rightColor = "#6cb92f";
  let dropTargetRegion = Dom7(`.${type}__svgContainer [data-code=${code}]`);
  dropTargetRegion.addClass("hover");
  dropTargetRegion.css({fill: rightColor});
  setTimeout(() => {
    dropTargetRegion.removeClass("hover");
    dropTargetRegion.css({fill: "#fff"});
  }, 1400);

}

function hover(props, monitor) {
  if(monitor.getItem() == null) {
    return;
  }
  const takenRegionCode = monitor.getItem().code;
  const sourceOffset = monitor.getClientOffset();
  let region = null;
  let crossRegionsCounter = [];
  let regions;
  switch (props.type) {
    case "make-map":
      regions = regions_make_map;
      break;
    case "put-names":
      regions = regions_put_names;
      break;
    default:
      break;
  }
  Array.from(regions).forEach((item) => {
    if(item.classList.contains("right-dropped")) {
      return;
    }
    const offset = item.getBoundingClientRect();
    const code = item.getAttribute("data-code");
    const help_influence = takenRegionCode === code ? 30 : 0;
    if(
        sourceOffset.x >= offset.left - help_influence && sourceOffset.x <= offset.left + offset.width + help_influence
        &&
        sourceOffset.y >= offset.top - help_influence && sourceOffset.y <= offset.top + offset.height + help_influence
    ) {
      crossRegionsCounter.push(item);
      region = item;
    } else {
      item.classList.remove("hover");
    }
  });
  if(crossRegionsCounter.length > 1) {
    crossRegionsCounter.forEach(item => {
      if(item.getAttribute("data-code") === takenRegionCode) {
        region = item;
      }
    });
  }
  if(region == null) {
    chosenRegion = null;
    return;
  }
  Array.from(regions).forEach((item) => {
    if(item.classList.contains("right-dropped")) {
      return;
    }
    if(item.getAttribute("data-code") !== region.getAttribute("data-code")) {
      item.classList.remove("hover");
    }
  });
  region.classList.add("hover");
  chosenRegion = region.getAttribute("data-code");
}

//var debouncedHover = _.debounce(hover, 20);
var debouncedHover = hover;

const mapTarget = {
  drop(props, monitor) {
    let item = monitor.getItem();
    if(chosenRegion == null) {
      return;
    }
    score++;
    let dropTargetRegion = Dom7(`.${props.type}__svgContainer .svg-region[data-code=${chosenRegion}]`);
    let notify = document.querySelectorAll(".correcter-notifier");
    if(item.code !== chosenRegion) {
      if(audioIncorrect != null) {
        audioIncorrect .play();
      }
      //let's help user
      if(error.code !== item.code) {
        error.code = item.code;
        error.counter = 1;
      } else {
        error.counter++;
      }
      if(error.counter >= 3) {
        helpUser(item.code, props.type);
      }
      dropTargetRegion.removeClass("hover");
      dropTargetRegion.addClass("wrong");
      const wrongColor = "#fc5d4f";
      dropTargetRegion.css({fill: wrongColor});
      setTimeout(() => {
        dropTargetRegion.removeClass("wrong");
        dropTargetRegion.css({fill: "#fff"})
      }, 1200);
      Array.from(notify).forEach(item => {
        item.innerText = words.wrong[LN];
        item.classList.add("visible", "wrong");
      });
      setTimeout(() => Array.from(notify).forEach(item => {
        item.classList.remove("visible", "wrong");
      }), 1900);
      return;
    }
    dropTargetRegion.addClass("right-dropped");
    const rightColor = "#6cb92f";
    dropTargetRegion.css({fill: rightColor});
    const colorToFill = colors[chosenRegion];
    setTimeout(() => dropTargetRegion.css({fill: colorToFill}), 1900);
    props.onDrop({ ...item, type: props.type });
    var title = document.querySelector(`.svg-region_name[data-code=${chosenRegion}]`);
    switch (props.type) {
      case "put-names":
        title.style.opacity = 1;
        break;
      default :
        break;
    }
    Array.from(notify).forEach(item => {
      const regionName = regions.find(item => item.code === chosenRegion).name;
      item.innerText = `${words.correct[LN]}\n${regionName}`;
      item.classList.add("visible");
      item.classList.add("correct");
    });
    setTimeout(() => Array.from(notify).forEach(item => {
      item.classList.remove("visible");
      item.classList.remove("correct");
    }), 1900);
    if(audioCorrect != null) {
      audioCorrect.play();
    }
    audioCorrect.play();
  },
  hover: debouncedHover
};

@DropTarget("DND_REGION", mapTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
class SVGMap extends Component {
  render() {
    const { style, xml, onMount, connectDropTarget, type } = this.props;
    const classIdentifier = `${type}__svgContainer`;
    return connectDropTarget(
        <div style={{overflow: "auto"}} className={classIdentifier}>
          <SVG
              style={style}
              xml={xml}
              onMount={onMount}/>
        </div>
    );
  }
}

function clearMap(type) {
  var regions = document.querySelectorAll(`.${type}__svgContainer .svg-region`); //define regions
  Array.from(regions).forEach((region) => {
    var $region = Dom7(region);
    $region.css({fill: "#fff"});
    $region.attr("class", "svg-region");
  });
}


function onMapMount() {
  switch (this) {
    case "make-map":
      regions_make_map = document.querySelectorAll(`.${this}__svgContainer .svg-region`); //define regions
      clearMap(this);
      break;
    case "put-names":
      var titles = document.querySelectorAll(`.${this}__svgContainer .svg-region_name`);
      Array.from(titles).forEach(item => {
        item.style.opacity = 0;
      });
      regions_put_names = document.querySelectorAll(`.${this}__svgContainer .svg-region`); //define regions
      clearMap(this);
      break;
    default:
      break;
  }
}


@DragDropContext(TouchBackend)
class MakeMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      zoom: 1
    };
    this.gameOverOk = this.gameOverOk.bind(this);
    this.gameOverAgain = this.gameOverAgain.bind(this);
    this.clearField = this.clearField.bind(this);
  }

  //shouldComponentUpdate = shouldPureComponentUpdate;

  componentDidMount() {
    audioWin = document.getElementById("audio_win");
    audioCorrect = document.getElementById("audio_correct");
    audioIncorrect = document.getElementById("audio_incorrect");
  }


  isGameOver(data, type) {
    const done_key = type === "make-map" ? "done_make_map" : "done_put_names";
    const len = data.count();
    return data.filter(item => item.get(done_key)).count() === len;
  }

  getCurrentProgress(data, type) {
    const done_key = type === "make-map" ? "done_make_map" : "done_put_names";
    return data.filter(item => item.get(done_key)).count();
  }

  zoomIn() {
    if(this.state.zoom >= 4.5) {
      return;
    }
    this.setState({ zoom: this.state.zoom + 0.5 });
  }

  zoomOut() {
    if(this.state.zoom <= 1) {
      return;
    }
    this.setState({ zoom: this.state.zoom - 0.5 });
  }

  gameOverAgain() {
    score = 0;
    this.clearField();
  }

  gameOverOk() {
    score = 0;
    mainView.router.back();
    this.clearField();
  }

  clearField() {
    const { type } = this.props;
    let regions, titles;
    switch (type) {
      case "make-map":
        regions = regions_make_map;
        titles = document.querySelectorAll(`.${type}__svgContainer .svg-region_name`);
        break;
      case "put-names":
        regions = regions_put_names;
        titles = document.querySelectorAll(`.${type}__svgContainer .svg-region_name`);
        break;
      default:
        break;
    }
    Array.from(regions).forEach((region) => {
      let $region = Dom7(region);
      $region.css({fill: "#fff"});
      region.classList.remove("right-dropped");
      region.classList.remove("hover");
    });
    Array.from(titles).forEach(item => {
      item.style.opacity = 0;
    });
    const { makeMapOver } = this.props;
    makeMapOver();
    this.setState({ zoom: 1 });
  }

  render() {
    const { map, rightDrop, type } = this.props;
    const { zoom } = this.state;

    if(this.isGameOver(map, type)) {
      setTimeout(() => audioWin.play(), 300);
      f7.modal({
        title: words.win[LN],
        text: `
        <img src="img/win.png" height="150">
        <br/>
        ${words.congratulations[LN]}
        <br/>
        <b>${words.resultScore[LN](score)}</b>
        `,
        buttons: [
          {
            text: words.again[LN],
            bold: true,
            onClick: this.gameOverAgain
          },
          {
            text: words.ok[LN],
            bold: true,
            onClick: this.gameOverOk
          }
        ]
      });
    }
    let mexicoMapSvg;
    switch (type) {
      case "make-map":
        mexicoMapSvg = require("./../../svg/mexico-map.svg");
        break;
      case "put-names":
        mexicoMapSvg = require("./../../svg/mexico-map2.svg");
        break;
      default:
        break;
    }
    return (
        <div className="makeMap">
          <div className="correcter-notifier"/>
          <ProgressCounter
              maxNum={map.count()}
              curNum={this.getCurrentProgress(map, type)}
              containerClass="progressCounter"
              textClass="progressCounter-text"/>
          <RegionsList data={map.toArray()} type={type}/>
          <Map>
            <div style={{overflow: "auto", width: "100%", height: "100%"}}>
              <SVGMap
                  type={type}
                  style={{width: `${100*zoom}%`}}
                  xml={mexicoMapSvg}
                  onMount={onMapMount.bind(this.props.type)}
                  onDrop={rightDrop}/>
              </div>
            <ZoomControl
                zoomIn={this.zoomIn.bind(this)}
                zoomOut={this.zoomOut.bind(this)}/>
          </Map>
          <CustomDragLayer type={type}/>
        </div>
    );
  }
}


const mapStateToProps = (state) => ({
  map: state.map
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(makeMapActions, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(MakeMap);
