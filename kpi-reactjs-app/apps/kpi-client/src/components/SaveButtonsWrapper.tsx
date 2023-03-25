import styled from 'styled-components';
import { StickyBottomBar } from 'src/components/StickyBottomBar';
import { rtlMargin } from 'shared/rtl';

export const SaveButtonsWrapper = styled(StickyBottomBar)`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  button + button,
  a + button {
    ${rtlMargin('15px', 0)}
  }
`;
