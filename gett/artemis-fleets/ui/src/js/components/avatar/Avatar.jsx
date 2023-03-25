import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CN from 'classnames';
import { Icon } from 'components';

import css from './Avatar.css';

export default class Avatar extends PureComponent {
  static propTypes = {
    src: PropTypes.string,
    size: PropTypes.number,
    className: PropTypes.string,
    squared: PropTypes.bool,
  };

  static defaultProps = {
    size: 180,
    squared: false
  };

  render() {
    const { size, src, className, squared } = this.props;

    return (
      <div className={ CN(css.avatar, { [css.rounded]: !squared }, className, 'white-bg') } style={ {width: `${size}px`, height: `${size}px`} }>
        { src
          ? <img src={ src } width={ `${size}px` } height={ `${size}px` } alt="avatar" />
          : <Icon className={ `text-${size} grey-text` } icon="UserIcon" />
        }
      </div>
    );
  }
}
