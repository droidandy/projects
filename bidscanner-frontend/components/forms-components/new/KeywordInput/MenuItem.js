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

  &:hover {
    color: #74bbe7;
  }
`;

type RecomposeProps = {
  onClick: () => void,
};

type ExternalProps = {
  subcategory: any,
  onSelect: string => void,
};

const enhance = compose(
  withHandlers({
    onClick: ({ subcategory, onSelect }) => () => {
      onSelect(subcategory);
    },
  })
);

type EnhancedType = Class<React$Component<void, ExternalProps, void>>;

const EnhancedComponent: EnhancedType = enhance((props: ExternalProps & RecomposeProps) => {
  const { subcategory, onClick } = props;

  return (
    <Button onClick={onClick}>
      {subcategory.name}
    </Button>
  );
});

export default EnhancedComponent;
