import React from 'react';

import { Badge } from './Badge';
import { ChecklistItem } from './types';
import * as s from './validationBadgesStyles';

type Props = {
  data: ChecklistItem[];
};

export const ValidationBadges = ({ data }: Props): JSX.Element => (
  <s.BadgesContainer>
    {data.map(({ msg, ok }, index) => (
      <Badge key={msg} active={ok} title={msg} />
    ))}
  </s.BadgesContainer>
);
