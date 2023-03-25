import React from 'react';

import * as Styled from './fundingButtonStyles';

import { ActionTypes, CallbackType } from '~/components/StepContainer/types';

type Props = {
  title: string;
  subtitle: string | undefined;
  callback?: CallbackType;
};

export const FundingButton = ({ title, subtitle, callback }: Props): JSX.Element => (
  <Styled.Container onPress={() => callback && callback({ type: ActionTypes.NEXT_SCREEN })}>
    <Styled.Title>{title}</Styled.Title>
    <Styled.Subtitle>{subtitle}</Styled.Subtitle>
  </Styled.Container>
);
