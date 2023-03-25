// @flow
import React from 'react';
import styled from 'styled-components';

import { Box } from 'grid-styled';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import WhiteButton from 'components/styled/WhiteButton';

const Title = styled.h2`
  display: inline;
  font-size: 2em;
  font-weight: bold;
`;

const ListContainer = styled.div`
  width: 100%;
  border-top: 1px solid #bcbec0;
`;

const RowContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #bcbec0;
  padding: 8px 0;
`;

const Name = styled.div`font-weight: bold;`;

const users = [
  { id: '1', name: 'Derill Sanders', company: 'pipingonline', country: 'USA' },
  { id: '2', name: 'Derill Sanders', company: 'pipingonline', country: 'USA' },
  { id: '3', name: 'Derill Sanders', company: 'pipingonline', country: 'USA' },
  { id: '4', name: 'Derill Sanders', company: 'pipingonline', country: 'USA' },
  { id: '5', name: 'Derill Sanders', company: 'pipingonline', country: 'USA' },
  { id: '6', name: 'Derill Sanders', company: 'pipingonline', country: 'USA' },
];

export default () =>
  <div>
    <Box mb={3}>
      <Title>MyNetwork</Title>
      <DropDownMenu
        value="all"
        underlineStyle={{ display: 'none' }}
        style={{ position: 'relative', top: '22px' }}
      >
        <MenuItem value="all" primaryText="All users" />
        <MenuItem value="followedby" primaryText="Users following me" />
        <MenuItem value="myfollowings" primaryText="Users I follow" />
      </DropDownMenu>
    </Box>
    <ListContainer>
      {users.map(user =>
        <RowContainer key={user.id}>
          <Box>
            <img src="https://placeimg.com/50/50/people" alt={user.name} />
          </Box>
          <Box px={2} flex="1 1 auto">
            <Name>
              {user.name}
            </Name>
            <Box>
              @{user.company}, {user.country}
            </Box>
          </Box>
          <Box>
            <WhiteButton>send message</WhiteButton> <WhiteButton primary>following</WhiteButton>
          </Box>
        </RowContainer>
      )}
    </ListContainer>
  </div>;
