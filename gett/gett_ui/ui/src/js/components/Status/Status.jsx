import React from 'react';
import PropTypes from 'prop-types';
import CN from 'classnames';
import css from './Status.css';

// @todo should be changed after designer will change other statuses
const COLORS = {
  'Rejected': 'red',
  'Cancelled': 'red',
  'Completed': 'green',
  'Active': 'green',
  'Inactive': 'red'
};

export default function Status({ value, className, small, indicator }) {
  return (
    <div className={ CN(css.status, css[COLORS[value]], className, 'layout horizontal center start-justified') }>
      <div className={ CN(indicator ? css.dotPulse : css.dot) } />
      {!small &&
        <div className={ CN(css.value, 'ml-10') }>
          { value }
        </div>
      }
    </div>
  );
}

Status.propTypes = {
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
  small: PropTypes.bool,
  indicator: PropTypes.bool
};
