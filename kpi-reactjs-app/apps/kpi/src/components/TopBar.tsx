import styled from 'styled-components';
import { rtlMargin } from 'shared/rtl';

export const TopBar = styled.div`
  display: flex;
  padding: 0 15px;
  align-items: stretch;
  ${rtlMargin('auto', 0)}
`;

export const TopBarIcon = styled.div`
  display: flex;
  align-self: center;
  align-items: center;
  justify-content: center;
  height: 44px;
  width: 44px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
  svg {
    border-radius: 4px;
    width: 17px;
    height: 17px;
  }
`;

export const TopBarText = styled.div`
  padding: 0 8px;
  display: flex;
  align-items: center;
  align-self: center;
  justify-content: center;
  height: 44px;
  cursor: pointer;
  border-radius: 4px;
`;

export const TopBarItem = styled.div`
  align-items: stretch;
  margin: 0;
  display: flex;
  &:hover {
    ${TopBarIcon}, ${TopBarText} {
      background-color: rgba(77, 89, 149, 0.06);
    }
  }
`;
