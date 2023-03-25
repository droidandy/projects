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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    color: #74bbe7;
  }
`;

type RecomposeProps = {
  onClick: () => void,
};

type ExternalProps = {
  item: {},
  getDisplayValue: any => string,
  onSelect: ({}) => void,
};

const enhance = compose(
  withHandlers({
    onClick: ({ item, onSelect }) => () => {
      onSelect(item);
    },
  })
);

type EnhancedType = Class<React$Component<void, ExternalProps, void>>;

const EnhancedComponent: EnhancedType = enhance((props: ExternalProps & RecomposeProps) => {
  const { item, getDisplayValue, onClick } = props;

  return (
    <Button onClick={onClick}>
      {getDisplayValue(item)}
    </Button>
  );
});

export default EnhancedComponent;
