import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import CN from 'classnames';

export default function ChartCard({ children, title, className, isPdf }) {
  return (
    <Card
      className={ CN(
        className,
        { 'page-break-avoid': isPdf },
        'flex sm-full-width mb-20'
      ) }
      title={ title }
    >
      { children }
    </Card>
  );
}

ChartCard.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.string,
  isPdf: PropTypes.bool
};
