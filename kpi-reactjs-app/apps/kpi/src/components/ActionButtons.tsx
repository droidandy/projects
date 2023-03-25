import styled from 'styled-components';
import { rtlPadding, rtlMargin } from 'shared/rtl';

export const ActionButtons = styled.div`
  ${rtlPadding('20px', 0)}
  button + button,
a + button {
    ${rtlMargin('10px', 0)}
  }
`;
