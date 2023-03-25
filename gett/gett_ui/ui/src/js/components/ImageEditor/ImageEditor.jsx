import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AvatarEditor from 'react-avatar-editor';
import { Upload, Modal, Slider } from 'antd';
import { Button, ButtonEdit, notification } from 'components';
import noop from 'lodash/noop';
import CN from 'classnames';

import css from './style.css';

const imageTypes = 'image/jpeg,image/pjpeg,image/png,image/gif,image/svg+xml';

export default class ImageEditor extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    imageUrl: PropTypes.string,
    fallbackUrl: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    border: PropTypes.number,
    borderRadius: PropTypes.number,
    color: PropTypes.arrayOf(PropTypes.number),
    uploadText: PropTypes.string,
    onApply: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
    dataName: PropTypes.string
  };

  static defaultProps = {
    width: 250,
    height: 250,
    border: 50,
    borderRadius: 250,
    color: [0, 0, 0, 0.6], // RGBA
    uploadText: 'Click to Upload'
  };

  state = {
    editMode: false
  };

  validateImage = (file) => {
    const isImage = /^image\/.*$/.test(file.type);
    const properSize = file.size / 1024 / 1024 < 50;

    if (!isImage) {
      notification.error('You can only use image files.');
    }
    if (!properSize) {
      notification.error('Image must be smaller than 50MB.');
    }
    return isImage && properSize;
  };

  handleChange = (info) => {
    const reader = new FileReader;
    const image = info.file.originFileObj;

    reader.addEventListener('load', () => {
      this.setState({
        editMode: true,
        previewUrl: reader.result,
        scale: 1
      });
    });

    reader.readAsDataURL(image);
  };

  handleScale = (scale) => {
    this.setState({ scale });
  };

  closeEditor = () => {
    this.setState({
      editMode: false,
      previewUrl: null,
      scale: null
    });
  };

  apply = () => {
    const canvas = this.editor.getImageScaledToCanvas();

    this.setState({
      editMode: false,
      previewUrl: false
    }, () => this.props.onApply(canvas.toDataURL()));
  };

  editorRef = (editor) => {
    this.editor = editor;
  };

  renderUpload() {
    const { imageUrl, fallbackUrl, uploadText, children, dataName } = this.props;

    return (
      <div>
        { typeof children === 'function'
          ? ((imageUrl || fallbackUrl) && children(imageUrl || fallbackUrl))
          : children
        }

        <Upload
          beforeUpload={ this.validateImage }
          onChange={ this.handleChange }
          customRequest={ noop }
          showUploadList={ false }
          accept={ imageTypes }
        >
          <Button size="small" type="secondary" data-name={ dataName }>
            { uploadText }
          </Button>
        </Upload>
      </div>
    );
  }

  renderEditor() {
    const { width, height, border, color, borderRadius } = this.props;
    const { previewUrl, scale } = this.state;

    return (
      <Modal
        visible
        title="Adjust Image"
        closable={ false }
        maskClosable={ false }
        footer={ [
          <ButtonEdit type="secondary" key="back" onClick={ this.closeEditor }>Cancel</ButtonEdit>,
          <ButtonEdit type="primary" key="submit" onClick={ this.apply }>Apply</ButtonEdit>
        ] }
      >
        <div className="text-center">
          <AvatarEditor
            ref={ this.editorRef }
            image={ previewUrl }
            { ...{ width, height, border, borderRadius, color, scale } }
          />
        </div>
        <div className="layout horizontal center-center">
          <Slider className={ CN('flex', css.w350) } min={ 0.1 } max={ 4 } step={ 0.001 } value={ scale } onChange={ this.handleScale } />
        </div>
      </Modal>
    );
  }

  render() {
    const { className } = this.props;

    return (
      <div className={ className }>
      { this.state.editMode
        ? this.renderEditor()
        : this.renderUpload()
      }
      </div>
    );
  }
}
