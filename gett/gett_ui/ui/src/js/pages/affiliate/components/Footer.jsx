import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Row } from 'antd';

export default class Footer extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    copyright: PropTypes.bool,
    affiliate: PropTypes.bool
  };

  render() {
    const year = new Date().getFullYear();

    return (
      <Row type="flex" align="middle" justify="end" className="footer light-grey-bg pb-10 pt-10 pr-40 pl-40 sm-p-10">
        <Row type="flex">
          <a target="_blank" rel="noopener noreferrer" href="https://gett.com/uk/legal/terms/" className="black-link bold-text text-12 mr-15">Terms & Conditions</a>
          <div className="text-12 mr-15">|</div>
          <a target="_blank" rel="noopener noreferrer" href="https://gett.com/uk/legal/privacy/" className="black-link bold-text text-12 mr-15">Privacy Policy</a>
          <div className="text-12 mr-15">|</div>
          <a target="_blank" rel="noopener noreferrer" href="https://gett.com/uk/contact-gbs/" className="black-link bold-text text-12">Contact Us</a>
        </Row>
        <div className="flex text-right">&copy;{ year } Gett, Inc. All rights reserved</div>
      </Row>
    );
  }
}
