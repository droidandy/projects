import React from 'react';
import PropTypes from 'prop-types';
import ApplicationForm from './ApplicationForm';
import { Modal, Button } from 'antd';
import { Icon } from 'components';

export default class ModalForm extends ApplicationForm {
  static propTypes = {
    ...ApplicationForm.propTypes,
    title: PropTypes.string,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    visible: PropTypes.bool,
    onRequestClose: PropTypes.func,
    onOpen: PropTypes.func
  };

  static defaultProps = {
    ...ApplicationForm.defaultProps,
    okText: 'Submit',
    cancelText: 'Cancel'
  };

  save = this.save.bind(this);

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible) {
      this._nextErrors = {};
    }

    super.componentWillReceiveProps(...arguments);
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible && !prevProps.visible) {
      this.onOpen();
    }
  }

  onOpen() {
    if (this.props.onOpen) this.props.onOpen();
  }

  getTitle() {
    return this.props.title;
  }

  render() {
    const { visible, onRequestClose, okText, cancelText, ...rest } = this.props;

    return (
      <Modal
        title={ this.getTitle() }
        visible={ visible }
        onOk={ this.save }
        onCancel={ onRequestClose }
        closable={ false }
        maskClosable={ false }
        footer={ [
          <Button className="btn-orange" key="back" onClick={ onRequestClose }>
            <Icon className="text-20 mr-10" icon="MdCancel" />
            { cancelText }
          </Button>,
          <Button className="btn-green" key="submit" onClick={ this.save }>
            <Icon className="text-20 mr-10" icon="MdSave" />
            { okText }
          </Button>
        ] }
        { ...rest }
      >
        { super.render() }
      </Modal>
    );
  }
}
