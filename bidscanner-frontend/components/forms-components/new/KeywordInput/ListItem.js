// @flow
import React from 'react';
import styled from 'styled-components';

import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

const Container = styled.span`
  font-weight: bold;
  margin-right: 8px;
  white-space: nowrap;
`;

const Button = styled.button`
  border: 0 none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  outline: none;

  svg {
    vertical-align: bottom;
    fill: #bcbec0;
  }
`;

type RecomposeProps = {
  onClick: () => void,
};

type ExternalProps = {
  id: string,
  name: string,
  onRemove: string => void,
};

const enhance = compose(
  withHandlers({
    onClick: ({ id, onRemove }) => () => {
      onRemove(id);
    },
  })
);

type EnhancedType = Class<React$Component<void, ExternalProps, void>>;

const EnhancedComponent: EnhancedType = enhance((props: ExternalProps & RecomposeProps) => {
  const { name, onClick } = props;

  return (
    <Container>
      #{name}
      <Button onClick={onClick}>
        <CloseIcon color="#BCBEC0" />
      </Button>
    </Container>
  );
});

export default EnhancedComponent;
