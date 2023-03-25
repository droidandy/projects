// @flow
import React from 'react';
import styled from 'styled-components';

import { Box } from 'grid-styled';

const BlackButton = styled.button`
  padding: 0.25em 1.5em;
  background-color: black;
  color: white;
  font-weight: bold;
  font-size: 1.5em;
  border-radius: 4px;
  border: 0 none;
  transition: all .2s ease-in-out;

  &:hover {
    cursor: pointer;
    background-color: #333;
  }
`;

const TextBox = styled(Box)`
  max-width: 500px;
`;

export default () =>
  <div>
    <Box>Welcome!</Box>
    <TextBox mt={2}>
      This is your operational dashboard, from here you can buy / sell products and services and manage your
      account.
    </TextBox>
    <TextBox mt={3}>
      <BlackButton>Take a tour</BlackButton>
    </TextBox>
  </div>;
