import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatPrice } from 'helper/formats';

export default class PropertyItem extends Component {
  static propTypes = {
    property: PropTypes.object.isRequired,
  };

  static defaultProps = {};

  render() {
    const { property } = this.props;

    return (
      <div className="propertyItem">
        <a href={property.url.details}>
          <div
            className="picture cover"
            style={{ background: `url(${property.thumbnail.s})` }}
          />
        </a>
        <div className="data">
          <a className="title" href={property.url.details}>
            {property.title}
          </a>
          <p className="price">
            {formatPrice(property.price, property.currency)}
          </p>
        </div>
      </div>
    );
  }
}
