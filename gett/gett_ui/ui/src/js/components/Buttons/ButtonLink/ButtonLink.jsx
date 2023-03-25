import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'components';
import CN from 'classnames';

export default class ButtonLink extends PureComponent {
  static propTypes = {
    to: PropTypes.string,
    href: PropTypes.string,
    download: PropTypes.bool,
    className: PropTypes.string,
    target: PropTypes.string,
    buttonClassName: PropTypes.string,
    disabled: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
      PropTypes.number
    ])
  };

  render() {
    const { to, href, className, buttonClassName, download, target, ...rest } = this.props;
    const linkClass = CN('inline-block', className);
    const button = <Button className={ buttonClassName } { ...rest } />;

    if (rest.disabled) return <span className={ linkClass }>{ button }</span>;

    return to
      ? <Link to={ to } className={ linkClass }>{ button }</Link>
      : <a href={ href } className={ linkClass } download={ download } target={ target }>{ button }</a>;
  }
}
