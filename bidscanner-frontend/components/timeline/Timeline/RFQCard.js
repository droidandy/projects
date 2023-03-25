// @flow
import React from 'react';
import styled from 'styled-components';

import { Box } from 'grid-styled';

const MutedTextBox = styled(Box)`
  color: #BCBEC0;
  font-size: 0.75rem;
`;

const Title = styled(Box)`
  font-size: 14px;
  width: 110px;
  text-overflow: ellipsis;
  overflow:hidden;
  white-space:nowrap; 
`;

export default ({ title, username }) =>
  <Box>
    <img src="https://placeimg.com/100/100/tech" alt={title} />
    <Title>
      {title}
    </Title>
    <MutedTextBox>
      {username}
    </MutedTextBox>
  </Box>;
