// @flow
import React from 'react';
import styled from 'styled-components';

const StyledText = styled.span`
  margin-right: 0.3rem;
  font-size: 1em;
  font-weight: bold;
`;

export type KeywordT = string;

export type KeywordProps = {
  keyword: KeywordT,
};

export default ({ keyword }: KeywordProps) =>
  <StyledText>
    #{keyword}
  </StyledText>;
