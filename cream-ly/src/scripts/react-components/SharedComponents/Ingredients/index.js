import React, { Component } from "react";
import "./index.scss";
import PropTypes from "prop-types";

export default class Ingredients extends Component {
  render() {
    return (
      <div className="row Ingredients">
        {this.props.ingredients && (
          <div className="col-lg-6">
            <h4>{this.props.ingredientsTitle}</h4>

            <div className="ingredients-option default">
              <ul>
                <li>{this.props.ingredients}</li>
              </ul>
            </div>
          </div>
        )}
        {this.props.usage && (
          <div className="col-lg-6">
            <h4>{this.props.usageTitle}</h4>
            <div className="item-catalog--time">{this.props.usage}</div>
          </div>
        )}
      </div>
    );
  }
}

Ingredients.propTypes = {
  ingredientsTitle: PropTypes.string,
  ingredients: PropTypes.string,
  usageTitle: PropTypes.string,
  usage: PropTypes.string,
};
