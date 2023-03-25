import styled from 'styled-components/native';

import { Button } from '~/components/atoms/button/Button';

export const Container = styled.View`
  position: absolute;
  bottom: 28px;
  left: 20px;
  right: 20px;
  flex: 1;
`;

export const MainButton = styled(Button).attrs<{ expanded: boolean }>(({ expanded }) => ({
  face: expanded ? 'selected' : 'blue',
}))<{ expanded: boolean }>`

`;

export const SecondaryButton = styled(Button).attrs(() => ({
  face: 'blue',
}))`
    
`;

export const ButtonSeparator = styled.View`
  height: 4px;
`;
