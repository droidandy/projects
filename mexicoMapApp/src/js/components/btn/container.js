/**
 * Created by developercomputer on 28.01.16.
 */
import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Button from "./btn.js";

import * as makeMapActions from "./../../actions/make-map-actions.js";

import { f7, mainView } from "./../../f7init.js";
import { words, LN } from "./../../words.js";


function clearMap(type) {
  var regions = document.querySelectorAll(`.${type}__svgContainer .svg-region`); //define regions
  var titles = document.querySelectorAll(`.${type}__svgContainer .svg-region_name`);
  setTimeout(() => {
    Array.from(regions).forEach((region) => {
      var $region = Dom7(region);
      $region.css({fill: "#fff"});
      $region.attr("class", "svg-region");
    });
    Array.from(titles).forEach(item => {
      item.style.opacity = 0;
    });
  }, 100);
}

@connect(
    () => ({}),
    (dispatch) => {
      return bindActionCreators(makeMapActions, dispatch);
    }
)
class StopGameBack extends Component {

  handleBack() {
    const { makeMapOver, type } = this.props;
    f7.modal({
      title: words.exit[LN],
      text: words.exitConfirmMessage[LN],
      buttons: [
        {
          text: words.no[LN]
        },
        {
          text: words.yes[LN],
          onClick: () => {
            mainView.router.back();
            clearMap(type);
            makeMapOver();
          }
        }
      ]
    });
  }

  render() {
    const { classList, children } = this.props;
    return (
        <Button
            classList={classList}
            onClick={this.handleBack.bind(this)}>
          {children}
        </Button>
    );
  }
}

export default StopGameBack;