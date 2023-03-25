// @flow
import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import Button from 'components/styled/FormButton';

const acceptedFormats = ['image/*', '.doc', '.xls', '.docx', '.pptx'].join(',');

const style = {
  width: '100%',
  height: '8rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#eee',
  fontWeight: 'bold',
};

const activeStyle = {
  backgroundColor: '#9EEBCF',
};

/* TODO: bug with styles
  bug: wrong styles are used for proper format
  step1: make .pptx file
  step2: try to drag it to dropzone -> wrong styles, though it will be accepted
*/
const rejectStyle = {
  backgroundColor: '#FF4136',
};

let dropzoneRef;

class FormDropzone extends Component {
  props: {
    placeholder: string

    /* TODO: update eslint
    input: {
      value: Array<{ name: string, size: string }>,
      onChange: Array<{ name: string, size: string }> => void
    }
    */
  };
  render() {
    const { placeholder, input: { value: filesWeHave, onChange } } = this.props;
    return (
      <div>
        <div>
          <Dropzone
            ref={(node) => {
              dropzoneRef = node;
            }}
            onDrop={droppedFiles => onChange([...filesWeHave, ...droppedFiles])}
            accept={acceptedFormats}
            style={style}
            activeStyle={activeStyle}
            rejectStyle={rejectStyle}
          >
            <span>{placeholder}</span>
          </Dropzone>
        </div>
        <div className="mt-2">
          <Button onClick={() => dropzoneRef.open()}>Open File Dialog</Button>
        </div>
        <div>
          {filesWeHave.map(file => <div>{file.name} - {file.size} bytes</div>)}
        </div>
      </div>
    );
  }
}

export default FormDropzone;
