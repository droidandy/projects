// @flow
import React from 'react';
import styled from 'styled-components';

import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

import { Flex, Box } from 'grid-styled';
import LinearProgress from 'material-ui/LinearProgress';

import { blue1, grey1 } from 'context/palette';

import AttachIcon from './attach.svg';
import CrossIcon from './cross.svg';

const StyledCrossIcon = styled(CrossIcon).attrs({
  width: 20,
  height: 20,
})`
  fill: ${grey1};
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
    color: ${blue1};
  }
`;

const StyledProgress = styled(LinearProgress).attrs({
  color: blue1,
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
        <AttachIcon fill={grey1} viewBox="4 0 24 24" />
      </Box>
      <NameBox w={1 / 2}>{name}</NameBox>
      {!completed && (
        <StyledProgress mode={progress === -1 ? 'indeterminate' : 'determinate'} max={1} value={progress} />
      )}
      <Box>
        <StyledCrossIcon onClick={onRemove} />
      </Box>
    </FileContainer>
  );
});

export default EnhancedComponent;
