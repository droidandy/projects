// @flow
import { Component } from 'react';
import PropTypes from 'prop-types';
import uuid4 from 'uuid/v4';
import config from 'context/config';
import { get } from 'lodash';

import setDisplayName from 'recompose/setDisplayName';
import wrapDisplayName from 'recompose/wrapDisplayName';
import createEagerFactory from 'recompose/createEagerFactory';

// import forbiddenExtentions from 'context/forbidden-extensions';

type FileDesc = {
  id: string,
  name: string,
  completed: boolean,
  progress: number,
  error: boolean,
  file: File,
};

const withFileUploader = (handler: (any, string, any) => void) => (
  BaseComponent: Class<React$Component<*, *, *>>
) => {
  const factory = createEagerFactory(BaseComponent);

  class WithFileUploader extends Component {
    componentWillUnmount() {
      if (this.xhr) {
        this.xhr.abort();
      }
    }

    uploadFile = (file: File): FileDesc => {
      const id = uuid4();
      // token
      const token = this.context.cookies.get('token');

      const xhr = new XMLHttpRequest();
      this.xhr = xhr;

      if (file.name.match(/.(jpg|jpeg|png)$/i)) {
        xhr.open('POST', `${config.BASE_URL}/photos`, true);
      } else {
        xhr.open('POST', `${config.BASE_URL}/documents`, true);
      }

      xhr.setRequestHeader('authorization', `Bearer ${token}`);
      const formData = new FormData();
      formData.append('data', file);
      formData.append('title', 'title');
      xhr.send(formData);

      if (xhr.upload) {
        xhr.upload.addEventListener(
          'progress',
          (event: ProgressEvent) => {
            handler(this.props, id, { progress: event.loaded / event.total });
          },
          false
        );
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          const response = JSON.parse(xhr.responseText);
          if (xhr.status !== 200) {
            const errorMessage = get(response, 'hint');
            handler(this.props, id, {
              completed: true,
              error: true,
              errorMessage,
            });
          } else {
            const bucketId = get(response, 'id');
            const bucketKey = get(response, 'images[0]["bucket-key"]');
            handler(this.props, id, {
              completed: true,
              bucketId,
              bucketKey,
            });
          }
        }
      };

      setTimeout(updateProgress, 100);

      // xhr.open('POST', 'action', true);
      // xhr.setRequestHeader('X-FILENAME', file.name);
      // xhr.send(file);

      return {
        id,
        name: file.name,
        completed: false,
        error: false,
        progress: -1,
        file,

        abortUpload() {
          xhr.abort();
        },
      };
    };

    render() {
      return factory({
        ...this.props,
        uploadFile: this.uploadFile,
      });
    }
  }

  WithFileUploader.contextTypes = {
    cookies: PropTypes.any,
  };

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'withFileUploader'))(WithFileUploader);
  }

  return WithFileUploader;
};

export default withFileUploader;
