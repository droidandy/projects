// @flow
import React from 'react';
import styled from 'styled-components';

import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

const Button = styled.button`
  display: block;
  border: 0 none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  outline: none;
  width: 100%;
  text-align: left;

  &:hover {
    color: #74bbe7;
  }
`;

type RecomposeProps = {
  onClick: () => void,
};

type ExternalProps = {
  manufacturer: {},
  onSelect: ({}) => void,
};

const enhance = compose(
  withHandlers({
    onClick: ({ manufacturer, onSelect }) => () => {
      onSelect(manufacturer);
    },
  })
);

type EnhancedType = Class<React$Component<void, ExternalProps, void>>;

const EnhancedComponent: EnhancedType = enhance((props: ExternalProps & RecomposeProps) => {
  const { manufacturer, onClick } = props;

  return (
    <Button onClick={onClick}>
      {manufacturer.name}
    </Button>
  );
});

export default EnhancedComponent;
