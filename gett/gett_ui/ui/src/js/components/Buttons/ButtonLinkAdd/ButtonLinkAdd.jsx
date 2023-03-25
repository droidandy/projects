import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ButtonLink, Icon, Phone } from 'components';
import CN from 'classnames';

export default class ButtonAddLink extends PureComponent {
  static propTypes = {
    to: PropTypes.string,
    value: PropTypes.string,
    className: PropTypes.string
  };

  render() {
    const { to, value, className } = this.props;

    return (
      <Phone>
        { (matches) => {
          return (
            <ButtonLink to={ to } type="primary" className={ className } buttonClassName={ CN({ mobile: matches }) }>
              <Icon className={ CN('text-20', { 'mr-10': !matches }) } icon="Add" />
              { !matches && value }
            </ButtonLink>
          );
        } }
      </Phone>
    );
  }
}
