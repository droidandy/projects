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

export default ({ categories, onSelect }) =>
  <Container>
    {categories.map(category =>
      <Box key={category.id}>
        <Box>
          {category.name}
        </Box>
        <Box ml={2} mb={2}>
          {category.subcategories.map(subcategory =>
            <MenuItem key={subcategory.id} subcategory={subcategory} onSelect={onSelect} />
          )}
        </Box>
      </Box>
    )}
  </Container>;
