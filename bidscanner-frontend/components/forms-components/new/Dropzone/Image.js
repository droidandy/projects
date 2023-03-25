// @flow
import React from 'react';
import styled from 'styled-components';

import type { InputProps } from 'redux-form';

import config from 'context/config';

import withRefs from 'utils/hoc/withRefs';
import withFileUploader from 'utils/hoc/withFileUploader';

import { compose, withHandlers, withState } from 'recompose';

import { Flex } from 'grid-styled';
import PhotoIcon from 'material-ui/svg-icons/image/photo-camera';
import Dropzone from 'react-dropzone';
import InfoIcon from '../InfoIcon';

import InitialView from './InitialView';
import File from './File';

const acceptedFormats = ['image/*', '.doc', '.xls', '.docx', '.pptx'].join(',');

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

const FileContainer = styled.div`padding: 3px ${props => (props.hasInfoText ? '1.5em' : '0.5em')} 0 0.5em;`;
const PreviewContainer = styled.div`text-align: center;`;
const UpdateButton = styled.button`
  border: 0 none;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  fill: white;
  width: 100%;
  display: block;
  cursor: pointer;
  border-radius: 0 0 4px 4px;
`;

const Image = styled.div`
  display: flex;
  height: 100px;
  justify-content: center;
  align-items: center;
`;

const enhance = compose(
  withRefs(),
  withState('localError', 'setLocalError', null),
  withFileUploader(({ input, setLocalError }, fileId, update) => {
    if (update.error) {
      setLocalError(`Something has happened! ${update.errorMessage ? update.errorMessage : ''}`);
      input.onChange(null);
    } else {
      input.onChange({ ...input.value, ...update });
    }
  }),
  withHandlers({
    onFilesAdd: ({ input, setLocalError, uploadFile }) => newFiles => {
      setLocalError(null);
      const fileDesc = uploadFile(newFiles[0]);
      input.onChange(fileDesc);
    },
    onFileRemove: ({ input }) => () => {
      // because we have only one file
      const file = input.value;
      file.abortUpload();
      input.onChange(null);
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
  input: InputProps & { value: {} },
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
    onOpen,
    setRef,
    onFileRemove,
    meta: { touched, error },
    localError,
  } = props;
  const { value: file } = input;

  return (
    <Flex w={'100%'} align="center" direction="column">
      <Container className={className} empty={!file}>
        <StyledDropzone
          innerRef={setRef('dropzone')}
          onDrop={onFilesAdd}
          accept={acceptedFormats}
          disableClick
          multiple={false}
        >
          {!file && <InitialView onOpen={onOpen} />}
          {file &&
          file.completed && (
            <PreviewContainer>
              <Image>
                <img
                  src={`${config.API_URL}/${file.bucketKey}`}
                  style={{ height: '100%', maxWidth: '100%' }}
                  alt={file.name}
                />
              </Image>
              <UpdateButton onClick={onOpen}>
                <PhotoIcon color="white" style={{ verticalAlign: 'middle' }} /> update logo
              </UpdateButton>
            </PreviewContainer>
          )}
          {file &&
          !file.completed && (
            <FileContainer hasInfoText={!!infoText}>
              <File {...file} onFileRemove={onFileRemove} />
            </FileContainer>
          )}
        </StyledDropzone>
        {infoText && <InfoIcon text={infoText} />}
      </Container>
      {/* the redux-form error is prioritise over the local one */}
      {touched && error ? <Error m={1}>{error}</Error> : localError && <Error m={1}>{localError}</Error>}
    </Flex>
  );
});

export default EnhancedComponent;
