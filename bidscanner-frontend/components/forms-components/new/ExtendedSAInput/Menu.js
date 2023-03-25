import React from 'react';
import styled from 'styled-components';

import WhiteButton from 'components/styled/WhiteButton';
import MutedText from 'components/styled/MutedText';
import MenuItem from './MenuItem';

const Container = styled.div`
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  background-color: white;
`;

const Items = styled.div`padding: 4px 16px;`;

const ActionBox = styled.div`
  border-top: 2px solid #bcbec0;
  padding: 4px 16px;
`;

export default ({ items, getDisplayValue, onSelect, actionText, actionHint, onAction }) =>
  <Container>
    <Items>
      {items.map(item =>
        <MenuItem key={item.id} item={item} getDisplayValue={getDisplayValue} onSelect={onSelect} />
      )}
    </Items>
    {onAction &&
      <ActionBox>
        <MutedText.Box>
          {actionHint}
        </MutedText.Box>
        <WhiteButton onClick={onAction}>
          {actionText}
        </WhiteButton>
      </ActionBox>}
  </Container>;
