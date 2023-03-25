// @flow
import React from 'react';
import styled from 'styled-components';

import TextField from 'material-ui/TextField';
import { Flex, Box } from 'grid-styled';


const SearchIcon = styled.i.attrs({
  className: 'fa fa-search',
  'aria-hidden': 'true',
})`
  font-size: 24px;
`;

export default () => (
  <Flex justify="center" align="flex-end">
    <TextField
      fullWidth
      defaultValue=""
      hintText="Search in timeline"
    />
    <Box mb="12px" ml={1}>
      <SearchIcon />
    </Box>
  </Flex>
);
