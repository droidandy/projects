// @flow
import React from 'react';
import styled from 'styled-components';

import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';

import CategoryList from './CategoryList';

const Container = styled.div`
  display: flex;
  height: 40vh;
  padding-right: 1px;
`;

const enhance = compose(
  withState('selectedMacrocat', 'setSelectedMacrocat', null),
  withState('selectedCat', 'setSelectedCat', null),
  withHandlers({
    onMacrocatSelect: props => value => {
      props.setSelectedMacrocat(value);
      props.setSelectedCat(null);
    },
    onCatSelect: props => value => {
      props.setSelectedCat(value);
    },
  })
);

type RecomposeProps = {
  selectedMacrocat?: {},
  selectedCat?: {},
  onMacrocatSelect: any => void,
  onCatSelect: any => void,
};

type ExternalProps = {
  macrocategories: {}[],
  onSelect: ({}) => void,
};

type EnhancedType = Class<React$Component<void, ExternalProps, void>>;

const EnhancedComponent: EnhancedType = enhance((props: ExternalProps & RecomposeProps) => {
  const {
    macrocategories,
    selected,
    onMacrocatSelect,
    onCatSelect,
    onSelect,
    selectedCat,
    selectedMacrocat,
  } = props;

  return (
    <Container>
      <CategoryList categories={macrocategories} onHover={onMacrocatSelect} highlighted={selectedMacrocat} />
      {selectedMacrocat &&
        <CategoryList
          categories={selectedMacrocat.categories}
          onHover={onCatSelect}
          highlighted={selectedCat}
        />}
      {selectedCat &&
        <CategoryList categories={selectedCat.subcategories} onClick={onSelect} selected={selected} />}
    </Container>
  );
});

export default EnhancedComponent;
