import React from 'react';

import * as s from './TrendLineStyles';

import { Icon } from '~/components/atoms/icon';
import Theme from '~/theme';

type Props = {
  type: 'up' | 'down';
};

export const TrendLine = ({ type }: Props): JSX.Element => (
  <Theme>
    <s.Container>
      <Icon name={`${type}Line`} size={21} />
    </s.Container>
  </Theme>
);
