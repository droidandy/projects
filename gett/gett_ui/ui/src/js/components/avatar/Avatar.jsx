import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CN from 'classnames';
import { isEmpty } from 'lodash';
import { Icon, Desktop } from 'components';
import logoOT from 'assets/images/logo-ot.png';
import css from './Avatar.css';

export default class Avatar extends PureComponent {
  static propTypes = {
    src: PropTypes.string,
    size: PropTypes.number,
    smSize: PropTypes.number,
    className: PropTypes.string,
    squared: PropTypes.bool,
    dataName: PropTypes.string,
    name: PropTypes.string,
    serviceType: PropTypes.string
  };

  static defaultProps = {
    size: 180,
    squared: false
  };

  getAcronym() {
    const { name } = this.props;

    if (isEmpty(name)) return;

    return name.trim().split(/\s+/).map(part => part[0]);
  }

  render() {

    const { size: propSize, smSize, src, className, squared, dataName, serviceType } = this.props;
    return (
      <Desktop>
        { (matches) => {
          const size = matches ? propSize : smSize || propSize;
          const abbr = this.getAcronym();
          return (
            <div className={ CN(css.avatar, { [css.rounded]: !squared }, className, 'white-bg') } style={ { width: size, minWidth: size, height: size } } data-name={ dataName } >
              { serviceType === 'ot'
                ? <img src={ logoOT } width={ size } height={ size } alt="avatar" />
                : src
                  ? <img src={ src } width={ size } height={ size } alt="avatar" />
                  : abbr
                    ? <div className={ css.generatedAvatar } style={ { fontSize: 0.80*size / abbr.length, lineHeight: size+'px' } }>{ abbr }</div>
                    : <Icon className={ `text-${size} grey-text` } icon="UserIcon" />
              }
            </div>
          );
        } }
      </Desktop>
    );
  }
}
