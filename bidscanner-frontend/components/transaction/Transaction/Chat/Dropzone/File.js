// @flow
import React from 'react';
import styled from 'styled-components';

import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

import { Flex, Box } from 'grid-styled';
import LinearProgress from 'material-ui/LinearProgress';
import AttachIcon from './attach.svg';
import CrossIcon from './cross.svg';

const StyledCrossIcon = styled(CrossIcon).attrs({
  width: 20,
  height: 20,
})`
  display: none;
  fill: #BCBEC0;
  margin-left: 8px;
  align-self: center;
`;

const NameBox = styled(Box)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 0 1 auto;
`;

const FileContainer = styled(Flex)`
  width: 100%;
  cursor: pointer;

  &:hover {
    color: #74BBE7;

    ${StyledCrossIcon} {
      display: block;
    }
  }
`;

const StyledProgress = styled(LinearProgress).attrs({
  color: '#74BBE7',
})`
  height: 2px !important;
  margin-left: 8px !important;
  align-self: center;
  flex: 1 1 auto;
  width: auto !important;
  min-width: 100px;
`;

const enhance = compose(
  withHandlers({
    onRemove: props => () => {
      props.onFileRemove(props.id);
    },
  })
);

type RecomposeProps = {
  onRemove: () => void,
};

type ExternalProps = {
  name: string,
  completed: boolean,
  progress: number,
};

type EnhancedType = Class<React$Component<void, ExternalProps, void>>;

const EnhancedComponent: EnhancedType = enhance((props: ExternalProps & RecomposeProps) => {
  const { name, completed, progress, onRemove } = props;

  return (
    <FileContainer>
      <Box>
        <AttachIcon fill="#BCBEC0" viewBox="4 0 24 24" />
      </Box>
      <NameBox>
        {name}
      </NameBox>
      {completed && <StyledCrossIcon onClick={onRemove} />}
      {!completed &&
        <StyledProgress mode={progress === -1 ? 'indeterminate' : 'determinate'} max={1} value={progress} />}
    </FileContainer>
  );
});

export default EnhancedComponent;
