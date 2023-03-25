import React from 'react';
import styled from 'styled-components';

import { Box } from 'grid-styled';
import MenuItem from './MenuItem';

const Container = styled.div`
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  background-color: white;
  padding: 4px 16px;
`;

export default ({ manufacturers, onSelect }) =>
  <Container>
    <Box>
      {manufacturers.map(manufacturer =>
        <MenuItem key={manufacturer.id} manufacturer={manufacturer} onSelect={onSelect} />
      )}
    </Box>
  </Container>;
