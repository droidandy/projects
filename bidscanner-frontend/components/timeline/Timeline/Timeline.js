// @flow
import React from 'react';
import styled from 'styled-components';

import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import formatDate from 'date-fns/format';

import type { EventsByDateGroup } from 'lib/types/EventsByDateGroup';

import { Box } from 'grid-styled';
import Event from './Event';


function formatAsDay(date: Date) {
  const days = differenceInCalendarDays(new Date(), date);

  if (days === 0) {
    return 'Today';
  }

  if (days === 1) {
    return 'Yesterday';
  }

  return formatDate(date, 'MMM D');
}

const RelativeBox = styled(Box)`
  position: relative;
`;

const Line = styled.div`
  position: absolute;
  top: 41px;
  bottom: 12px;
  left: 4px;
  width: 0;
  border: 1px solid #E1E1E1;
  z-index: 0;
`;

const Heading = styled.h6`
  font-weight: bold;
  margin-left: 26px;
  font-size: 1.2em;
`;

type Props = { eventsByDate: EventsByDateGroup[] };

export default ({ eventsByDate }: Props) => (
  <RelativeBox>
    <Line />
    <RelativeBox>
      {
        eventsByDate.map(group => (
          <Box mb={2}>
            <Heading>{formatAsDay(group.date)}</Heading>
            {
              group.events.map(event => (
                <Event key={event.id} {...event} />
              ))
            }
          </Box>
        ))
      }
    </RelativeBox>
  </RelativeBox>
);
