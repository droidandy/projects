import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ImportUsers } from 'components';
import { Modal } from 'antd';

export default class ImportUsersPopup extends PureComponent {
  static propTypes = {
    onClose: PropTypes.func
  };

  state = {
    open: false
  };

  setImportRef = imprt => this.import = imprt;

  open = () => {
    this.setState({ open: true });
  };

  close = () => {
    this.setState({ open: false }, () => {
      const { onClose } = this.props;

      this.import.reset();
      if (onClose) onClose();
    });
  };

  render() {
    return (
      <Modal
        footer={ null }
        visible={ this.state.open }
        onCancel={ this.close }
      >
        <ImportUsers showVideo={ false } ref={ this.setImportRef } />
      </Modal>
    );
  }
}
