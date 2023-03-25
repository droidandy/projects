import styled from 'styled-components/native';

import { Button } from './Button';

export const Wrapper = styled.View`
  padding-top: 16px;
  padding-left: 20px;
  padding-right: 20px;
`;

export const ReactionsWrapper = styled.View`
  flex-direction: row;
  width: 100%;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

export const AddReactionButton = styled(Button)`
  width: 154px
`;
