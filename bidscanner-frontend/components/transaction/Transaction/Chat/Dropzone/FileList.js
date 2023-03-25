// @flow
import React from 'react';
import styled from 'styled-components';

import type { InputProps } from 'redux-form';

import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withRefs from 'utils/hoc/withRefs';
import withFileUploader from 'utils/hoc/withFileUploader';

import Dropzone from 'react-dropzone';

import Files from './Files';

const acceptedFormats = ['image/*', '.doc', '.xls', '.docx', '.pptx'].join(',');

const StyledDropzone = styled(Dropzone)`
  position: relative;
  z-index: 2;
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  border: ${props => (props.empty ? '0px' : '1px')} solid #e1e1e1;
  border-radius: 4px;
`;

const enhance = compose(
  withRefs(),
  withFileUploader(({ input }, fileId, update) => {
    const newValue = input.value.map(file => (file.id === fileId ? { ...file, ...update } : file));
    input.onChange(newValue);
  }),
  withHandlers({
    onFilesAdd: ({ input, uploadFile }) => newFiles => {
      const newDescs = newFiles.map(file => uploadFile(file));
      input.onChange([...input.value, ...newDescs]);
    },
    onFileRemove: ({ input }) => fileId => {
      const file = input.value.find(file => file.id === file.id);

      if (!file) return;

      const newValue = input.value.reduce((memo, file) => (file.id === fileId ? memo : [...memo, file]), []);

      file.abortUpload();
      input.onChange(newValue);
    },
    onOpen: props => () => {
      props.refs.dropzone.open();
    },
  })
);

type RecomposeProps = {
  onFileRemove: (fileId: string) => void,
  onFilesAdd: () => void,
  onOpen: () => void,
  setRef: string => any => void,
  refs: any,
};

type ExternalProps = {
  className?: string,
  infoText?: string,
  input: InputProps & { value: any[] },
};

type EnhancedType = Class<React$Component<void, ExternalProps, void>>;

const EnhancedComponent: EnhancedType = enhance((props: ExternalProps & RecomposeProps) => {
  const { className, input, onFilesAdd, onFileRemove, onOpen, setRef } = props;
  const { value: files } = input;

  return (
    <Container className={className} empty={files.length === 0}>
      <StyledDropzone innerRef={setRef('dropzone')} onDrop={onFilesAdd} accept={acceptedFormats} disableClick>
        {files.length > 0 && <Files files={files} onFileRemove={onFileRemove} onMore={onOpen} />}
      </StyledDropzone>
    </Container>
  );
});

export default EnhancedComponent;
