import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'antd';

export default function Breadcrumbs({ children }) {
  return (
    <Row type="flex" align="middle" justify="space-between" className="title text-uppercase navy-text text-20 pr-20 pl-20">
      { children }
    </Row>
  );
}

Breadcrumbs.propTypes = {
  children: PropTypes.node
};
