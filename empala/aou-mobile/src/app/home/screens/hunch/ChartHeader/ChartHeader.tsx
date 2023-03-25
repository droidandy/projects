import React from 'react';
import { Text } from 'react-native';

import * as s from './styles';
import {
  AuthorName, Avatar, PercentAndDate, RowView,
} from './styles';

import { FallingChartIcon, GrowingChartIcon } from '~/assets/icons';

const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

type Props = {
  percentageChange: number;
  byDate: string;
  authorName: string;
  authorAvatar: string;
};

export const ChartHeader = ({
  percentageChange, byDate, authorAvatar, authorName,
}: Props): JSX.Element => (
  <s.Wrapper>
    <RowView>
      {percentageChange > 0 ? <GrowingChartIcon /> : <FallingChartIcon />}
      <PercentAndDate>
        <Text>{percentageChange ?? 0}</Text>
        {'% '}
        by
        {' '}
        <Text>{byDate && new Date(byDate).toLocaleDateString('en-US', options)}</Text>
      </PercentAndDate>
    </RowView>
    <RowView>
      <AuthorName>
        @
        {authorName}
      </AuthorName>
      <Avatar source={{ uri: `data:image/png;base64,${authorAvatar}` }} />
    </RowView>
  </s.Wrapper>
);
