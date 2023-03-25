import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { UserProfile } from 'components';
import { roomDefault } from 'helper/common';
import ArticleDetails from '../Article/ArticleDetails';
import PropertyDetails from '../Property/PropertyDetails';

export default class RoomDetails extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  get layer() {
    const { data } = this.props;
    const article = { Component: ArticleDetails, properties: { data } };
    const property = { Component: PropertyDetails, properties: { data } };
    const user = { Component: UserProfile, properties: { data } };
    const layers = { article, property, user };
    return layers[data?.type]?.Component ? layers[data?.type] : roomDefault;
  }

  render() {
    const { className } = this.props;
    const { Component, properties } = this.layer;
    return (
      <aside className={className}>
        <Component {...properties} />
      </aside>
    );
  }
}
