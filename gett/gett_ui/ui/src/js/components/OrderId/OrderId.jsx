import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { stopPropagation } from 'utils';

export default class OrderId extends PureComponent {
  static propTypes = {
    vendorName: PropTypes.string,
    isLink: PropTypes.bool,
    serviceId: PropTypes.string,
  };

  getLinkHref () {
    const { serviceId, vendorName } = this.props;

    switch (vendorName) {
      case 'Gett UK':
        return `https://uk.gett.com/admin/orders/${serviceId}?locale=en-UK`;
      case 'Gett IL':
        return `https://il.gett.com/admin/orders/${serviceId}?locale=en-UK`;
      case 'Gett RU':
        return `https://ru.gett.com/admin/orders/${serviceId}?locale=en-RU`;
    }
  }

  render() {
    const { isLink, serviceId } = this.props;
    const href = this.getLinkHref();

    return isLink && href && serviceId
      ? <a href={ href } onClick={ stopPropagation } target="_blank" rel="noopener noreferrer">{ serviceId }</a>
      : <span>{ serviceId || 'N/A' }</span>;
  }
}
