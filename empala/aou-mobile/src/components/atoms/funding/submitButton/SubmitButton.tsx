import React from 'react';

import * as Styled from './submitButtonStyles';

type Props = {
  enabled: boolean;
  title: string;
  onSubmit: () => void;
};

export const SubmitButton = ({ title, enabled, onSubmit }: Props): JSX.Element => (
  <Styled.ContinueContainer>
    <Styled.Continue
      style={{
        backgroundColor: (enabled ? '#55a333' : null)?.toString(),
      }}
      onPress={onSubmit}>
      <Styled.ContinueText>{title}</Styled.ContinueText>
    </Styled.Continue>
  </Styled.ContinueContainer>
);
