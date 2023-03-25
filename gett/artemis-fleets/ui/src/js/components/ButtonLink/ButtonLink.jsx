import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

export default class ButtonLink extends PureComponent {
  static propTypes = {
    to: PropTypes.string,
    className: PropTypes.string,
    buttonClassName: PropTypes.string
  };

  render() {
    const { to, className, buttonClassName, ...rest } = this.props;

    return (
      <Link to={ to } className={ className }>
        <Button className={ buttonClassName } { ...rest } />
      </Link>
    );
  }
}
