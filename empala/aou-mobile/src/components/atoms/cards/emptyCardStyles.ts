import styled, { css } from 'styled-components/native';

import { EmptyCardTypes } from './types';

export const Container = styled.TouchableOpacity<{ type?: string; first?: boolean; }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  background: #FFFFFF20;
  overflow: hidden;
  width: 72px;
  height: 72px;
  margin-right: ${({ first }): string => (!first ? '22px' : '0')};

  ${({ type, first }) => type === EmptyCardTypes.Investack
    && css`
      width: 104px;
      height: 155px;
      padding: 7px 6px 12px 8px;
      margin-left: ${!first ? '12px' : '0'};
  `}

  ${({ type, first }) => type === EmptyCardTypes.Hunch
    && css`
      width: 162px;
      height: 144px;
      padding: 10px 9px 11px 10px;
      margin-left: ${!first ? '14px' : '0'};
  `}

`;
