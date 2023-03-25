// @flow
import React from 'react';
import styled from 'styled-components';

import { Box } from 'grid-styled';
import WhiteButton from 'components/styled/WhiteButton';

const MutedTextBox = styled(Box)`
  color: #BCBEC0;
  font-size: 0.75rem;
`;

const Name = styled(Box)`
  font-size: 14px;
`;

type Props = {
  name: string,
  company: string,
  country: string,
};

export default ({ name, company, country }: Props) =>
  <Box>
    <img src="https://placeimg.com/100/100/people" alt={name} />
    <Name>
      {name}
    </Name>
    <MutedTextBox>
      @{company}, {country}
    </MutedTextBox>
    <Box>
      <WhiteButton>follow</WhiteButton>
    </Box>
  </Box>;
