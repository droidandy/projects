import React, { ReactNode } from 'react';

import * as Styled from './fundFlowContainerStyles';

import { ScreenConfig } from '~/components/StepContainer/types';

type Props = {
  screenConfig: ScreenConfig;
  children: ReactNode;
};

export const FundFlowContainer = ({ screenConfig, children }: Props): JSX.Element => (
  <Styled.Container>
    <Styled.TitleContainer>
      <Styled.TitleText>{screenConfig && screenConfig.title}</Styled.TitleText>
    </Styled.TitleContainer>
    <Styled.Content>{children}</Styled.Content>
  </Styled.Container>
);
