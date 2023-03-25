import React from 'react';
import Button from '../Button';
import { Icon, Phone } from 'components';
import CN from 'classnames';

export default class ButtonIcon extends Button {
  render() {
    const { children, icon, iconClassName } = this.props;

    return (
      <Phone>
        { (matches) => {
          return (
            <Button { ...this.props } className="mobile">
              <Icon className={ CN('text-20 mr-10 sm-m-0', iconClassName) } icon={ icon } />
              { !matches && children }
            </Button>
          );
        } }
      </Phone>
    );
  }
}
