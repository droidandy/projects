import React from 'react';

import * as s from './validationBadgesStyles';

type Props = {
  active: boolean;
  title: string;
};

export const Badge = ({ active, title }: Props): JSX.Element => {
  const Icon = active ? (
    <s.Check>
      <s.CheckmarkPart1 />
      <s.CheckmarkPart2 />
    </s.Check>
  ) : (
    <s.Dash />
  );

  return (
    <s.ItemContainer active={active}>
      {Icon}
      <s.Title>{title}</s.Title>
    </s.ItemContainer>
  );
};
