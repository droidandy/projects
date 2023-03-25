import React from 'react';
import CN from 'classnames';
import Button from '../Button';

export default class ButtonEdit extends Button {
  render() {
    return (
      <Button { ...this.props } className={ CN(this.props.className, 'ant-btn-edit') } />
    );
  }
}
