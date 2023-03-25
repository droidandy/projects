import React from 'react';

import * as Styled from './badgeStyles';

type Props = {
  title: string;
  iconName: string;
};

export const Badge = ({ title, iconName }: Props): JSX.Element => (
  <Styled.Container>
    <Styled.OuterCircle>
      <Styled.InnerCircle>
        <Styled.BadgeIcon name={iconName} />
      </Styled.InnerCircle>
    </Styled.OuterCircle>
    <Styled.Text>{title}</Styled.Text>
  </Styled.Container>
);
