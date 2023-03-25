// @flow
import React from 'react';
import styled from 'styled-components';
import Dropzone from 'react-dropzone';

import type { InputProps } from 'redux-form';

import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withRefs from 'utils/hoc/withRefs';
import withFileUploader from 'utils/hoc/withFileUploader';
import ClipSVG from '../../../../svg/clip.svg';

const acceptedFormats = ['image/*', '.doc', '.xls', '.docx', '.pptx'].join(',');

const StyledDropzone = styled(Dropzone)`
  position: relative;
  z-index: 2;
`;

const Button = styled.button`
  border: none;
  background-color: white;
  paddin: 0px 0px;
  cursor: pointer;
  &:active,
  &:focus {
    outline: none;
  }
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
  const { onFilesAdd, onOpen, setRef } = props;

  return (
    <StyledDropzone innerRef={setRef('dropzone')} onDrop={onFilesAdd} accept={acceptedFormats} disableClick>
      <Button onClick={onOpen}>
        <ClipSVG />
      </Button>
    </StyledDropzone>
  );
});

export default EnhancedComponent;
