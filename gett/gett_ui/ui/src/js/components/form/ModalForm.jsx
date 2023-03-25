import React from 'react';
import PropTypes from 'prop-types';
import ApplicationForm from './ApplicationForm';
import { ButtonEdit } from 'components';
import { Modal } from 'antd';

export default class ModalForm extends ApplicationForm {
  static propTypes = {
    ...ApplicationForm.propTypes,
    title: PropTypes.string,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    visible: PropTypes.bool,
    onRequestClose: PropTypes.func,
    onOpen: PropTypes.func,
    componentName: PropTypes.string,
    loadingProp: PropTypes.string
  };

  static defaultProps = {
    ...ApplicationForm.defaultProps,
    okText: 'Save',
    cancelText: 'Cancel',
    loadingProp: 'loading',
    loading: false
  };

  save = this.save.bind(this);

  componentDidUpdate(prevProps) {
    if (this.props.visible && !prevProps.visible) {
      this.setErrors({});
      this.onOpen();
    }
  }

  onOpen() {
    if (this.props.onOpen) this.props.onOpen();
  }

  getTitle() {
    return this.props.title;
  }

  getFooter() {
    const { okText, cancelText, onRequestClose, loadingProp, [loadingProp]: loading } = this.props;

    return [
      <ButtonEdit type="secondary" key="back" onClick={ onRequestClose }>
        { cancelText }
      </ButtonEdit>,
      <ButtonEdit type="primary" key="submit" onClick={ this.save } loading={ !!loading }>
        { okText }
      </ButtonEdit>
    ];
  }

  get componentName() {
    // componentName is needed for case when component is used more then one time
    return this.props.componentName || this.constructor.name;
  }

  render() {
    const { visible, onRequestClose, ...rest } = this.props;

    return (
      <Modal
        title={ this.getTitle() }
        visible={ visible }
        onOk={ this.save }
        onCancel={ onRequestClose }
        closable={ false }
        maskClosable={ false }
        footer={ this.getFooter() }
        { ...rest }
      >
        { super.render() }
      </Modal>
    );
  }
}
