import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CN from 'classnames';
import css from './Indicator.css';

export default class Indicator extends PureComponent {
  static propTypes = {
    size: PropTypes.number,
    className: PropTypes.string,
    color: PropTypes.string
  };

  static defaultProps = {
    size: 24,
    color: 'blue'
  };

  render() {
    const { size, className, color } = this.props;

    return (
      <div
        className={ CN(css.indicator, css[color], className, 'relative shrink-0') }
        style={ { width: size, height: size } }
      />
    );
  }
}
