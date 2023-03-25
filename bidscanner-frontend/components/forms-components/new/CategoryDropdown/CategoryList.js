// @flow
import React from 'react';
import styled from 'styled-components';

import compose from 'recompose/compose';
// import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';

// import { Box } from 'grid-styled';
import CategoryListItem from './CategoryListItem';

const Container = styled.div`
  border: 1px solid #bcbec0;
  border-radius: 2px;
  background-color: white;
  padding: 8px 0;
  height: 100%;
  max-width: 250px;
  margin-right: -1px;
  overflow-y: auto;
  overflow-x: visible;
`;

const enhance = compose(
  // withState('selectedMacrocat', 'setSelectedMacrocat', null),
  // withState('selectedCat', 'setSelectedCat', null),
  withHandlers({
    onMacrocatSelect: props => value => {
      props.setSelectedMacrocat(value);
    },
    onCatSelect: props => value => {
      props.setSelectedCat(value);
    },
  })
);

type RecomposeProps = {
  // selectedMacrocat?: {},
  // selectedCat?: {},
  // onMacrocatSelect: any => void,
  // onCatSelect: any => void,
};

type ExternalProps = {
  categories: {}[],
  highlighted?: {},
  selected?: {}[],
  onHover?: ({}) => void,
  onClick?: ({}) => void,
};

type EnhancedType = Class<React$Component<void, ExternalProps, void>>;

const EnhancedComponent: EnhancedType = enhance((props: ExternalProps & RecomposeProps) => {
  const { categories, onHover, onClick, highlighted, selected } = props;

  return (
    <Container>
      {categories.map(category =>
        <CategoryListItem
          key={category.id}
          onSelect={onHover || onClick}
          onHover={onHover}
          onClick={onClick}
          category={category}
          highlighted={!!highlighted && highlighted.id === category.id}
          selected={selected && selected.some(sc => sc.id === category.id)}
        />
      )}
    </Container>
  );
});

export default EnhancedComponent;
