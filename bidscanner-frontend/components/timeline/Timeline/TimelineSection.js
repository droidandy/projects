// @flow
import React from 'react';
import styled from 'styled-components';

import type { EventsByDateGroup } from 'lib/types/EventsByDateGroup';

import { Box } from 'grid-styled';
import MoreButton from 'components/styled/MoreButton';

import SearchBar from './SearchBar';
import Timeline from './Timeline';


const SearchBarBox = styled(Box)`
  max-width: 450px;
  width: 100%;
`;

type Props = {
  eventsByDate: EventsByDateGroup[],
};

export default ({ eventsByDate }: Props) => (
  <div>
    <SearchBarBox mb={2}>
      <SearchBar />
    </SearchBarBox>
    <Timeline eventsByDate={eventsByDate} />
    <Box mt={2}>
      <MoreButton>see more...</MoreButton>
    </Box>
  </div>
);
