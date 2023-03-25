import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, Spin } from 'antd';
import Comments from './components/Comments';

export default class CommentsPopup extends PureComponent {
  static propTypes = {
    comments: PropTypes.arrayOf(PropTypes.object),
    visible: PropTypes.bool,
    warning: PropTypes.string,
    onShow: PropTypes.func,
    onAdd: PropTypes.func,
    onClose: PropTypes.func
  };

  state = {
    loading: false
  };

  componentDidUpdate(prevProps) {
    const { onShow, visible } = this.props;
    if (visible && prevProps.visible !== visible) {
      // popup is opened
      this.setState({ loading: true });

      onShow().then(() => {
        this.setState({ loading: false });
      });
    }
  }

  render() {
    const { visible, comments, onAdd, onClose, warning, ...rest } = this.props;
    const { loading } = this.state;

    return (
      <Modal
        width={ 1024 }
        title="Comments"
        footer={ null }
        visible={ visible }
        onCancel={ onClose }
        { ...rest }
      >
        <Spin spinning={ loading } >
          <Comments
            warning={ warning }
            onAdd={ comment => onAdd(comment) }
            comments={ comments }
          />
        </Spin>
      </Modal>
    );
  }
}
