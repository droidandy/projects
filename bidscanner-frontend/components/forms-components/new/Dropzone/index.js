// @flow
import React from 'react';
import styled from 'styled-components';

import type { InputProps } from 'redux-form';

import { compose, withHandlers, withState } from 'recompose';
import withRefs from 'utils/hoc/withRefs';
import withFileUploader from 'utils/hoc/withFileUploader';

import { Flex } from 'grid-styled';
import Dropzone from 'react-dropzone';
import InfoIcon from '../InfoIcon';

import InitialView from './InitialView';
import Files from './Files';

const acceptedFormats = ['image/*', '.doc', '.xls', '.docx', '.pptx', '.rtf'].join(',');

const StyledDropzone = styled(Dropzone)`
  position: relative;
  z-index: 2;
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  border: 1px ${props => (props.empty ? 'dashed' : 'solid')} #e1e1e1;
  border-radius: 4px;
`;

const enhance = compose(
  withRefs(),
  withState('localError', 'setLocalError', null),
  withFileUploader(({ input, setLocalError, onFieldChange }, fileId, update) => {
    if (update.error) {
      setLocalError(`Something has happened! ${update.errorMessage ? update.errorMessage : ''}`);
      // remove file that caused the error
      const newValue = input.value.reduce((memo, file) => (file.id === fileId ? memo : [...memo, file]), []);
      input.onChange(newValue);
    } else {
      const newValue = input.value.map(file => (file.id === fileId ? { ...file, ...update } : file));
      input.onChange(newValue);
      // if we want to invoke anything after file was uploaded
      if (onFieldChange) {
        onFieldChange(newValue);
      }
    }
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

const Error = styled.span`
  color: #ff2929;
  font-size: 12px;
`;

const EnhancedComponent: EnhancedType = enhance((props: ExternalProps & RecomposeProps) => {
  const {
    className,
    infoText,
    input,
    onFilesAdd,
    onFileRemove,
    meta: { touched, error },
    onOpen,
    setRef,
    localError,
  } = props;
  const { value: files } = input;

  return (
    <Flex w={'100%'} align="center" direction="column">
      <Container className={className} empty={files.length === 0}>
        <StyledDropzone
          innerRef={setRef('dropzone')}
          onDrop={onFilesAdd}
          accept={acceptedFormats}
          disableClick
        >
          {files.length > 0 ? (
            <Files files={files} onFileRemove={onFileRemove} onMore={onOpen} />
          ) : (
            <InitialView onOpen={onOpen} />
          )}
        </StyledDropzone>
        {infoText && <InfoIcon text={infoText} />}
      </Container>
      {/* the redux-form error is prioritised over the local one */}
      {touched && error ? <Error m={1}>{error}</Error> : localError && <Error m={1}>{localError}</Error>}
    </Flex>
  );
});

export default EnhancedComponent;
