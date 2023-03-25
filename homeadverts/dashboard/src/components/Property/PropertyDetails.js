import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PhotoLibrary } from '@material-ui/icons';
import { formatPrice } from 'helper/formats';

export default class PropertyDetails extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  render() {
    const { data: { property } } = this.props;

    return (
      <div className="propertyDetails">

        <div
          className="picture cover"
          style={{ background: `url(${property.thumbnail.l})` }}
        >
          <div className="fullscreen">
            <PhotoLibrary />
          </div>
        </div>

        <div className="shortInfo">
          <a href={property?.url?.country} className="category">
            {property?.address?.countryName}, {property?.address?.stateCounty}
          </a>
          <a href={property?.url?.details} className="title">
            {property?.title}
          </a>
          <p className="intro">
            {property?.intro}
          </p>
        </div>

        {property?.address && (
          <div className="bottomActions">
            <p>
              {property?.address?.street}, {property?.address?.townCity}, {property?.address?.zip}
            </p>
            <hr />
            <p>
              {formatPrice(property?.price, property?.currency)}
            </p>
            <hr />
            <p>
              {property?.bathrooms} Bathrooms
            </p>
            <hr />
            <p>w
              {property?.bedrooms} Bedrooms
            </p>
            <hr />
            <p>
              Interior {property?.grossLivingArea} sq.m
            </p>
            <hr />
            <p>
              Exterior {property?.plotArea} sq.m
            </p>
            <hr />
            <p>
              Year Built {property?.plotArea}
            </p>
            <hr />
            <a href={property?.sourceUrl} className="sourceLink">
              MLS {property?.mlsRef}
            </a>
          </div>
        )}
      </div>
    );
  }
}
