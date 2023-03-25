// @flow
import React from 'react';
import styled from 'styled-components';

import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';

const Button = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  background: transparent;
  padding: 0 16px;
  cursor: pointer;
  font-weight: ${props => (props.selected ? 'bold' : 'normal')};
  border-style: solid;
  border-width: 1px 0;
  border-color: ${props => (props.highlighted ? '#bcbec0' : 'transparent')};

  &:hover {
    color: #74bbe7;
  }

  &:focus,
  &:active {
    outline: none;
  }
`;

type RecomposeProps = {
  onBtnClick: () => void,
  onBtnHover: () => void,
};

type ExternalProps = {
  category: any,
  selected: boolean,
  highlighted: boolean,
  onClick?: ({}) => void,
  onHover?: ({}) => void,
};

const enhance = compose(
  withHandlers({
    onBtnClick: ({ category, onClick }) => () => {
      if (onClick) onClick(category);
    },
    onBtnHover: ({ category, onHover }) => () => {
      if (onHover) onHover(category);
    },
  })
);

type EnhancedType = Class<React$Component<void, ExternalProps, void>>;

const EnhancedComponent: EnhancedType = enhance((props: ExternalProps & RecomposeProps) => {
  const { category, selected, highlighted, onBtnClick, onBtnHover } = props;

  return (
    <Button onClick={onBtnClick} onMouseOver={onBtnHover} selected={selected} highlighted={highlighted}>
      {category.name}
    </Button>
  );
});

export default EnhancedComponent;
