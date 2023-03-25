import styled, { css } from 'styled-components/native';

interface ContainerProps {
  readonly isActive: boolean;
}

export const Container = styled.TouchableOpacity<ContainerProps>`
  margin: 4px 7px 4px 7px;
  padding: 0 8px;
  height: 52px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  border-radius: 120px;
  ${({ theme, isActive }) => isActive
    && css`
      background-color: ${theme.colors.White};
    `}
  ${({ theme, isActive }) => !isActive
    && css`
      border-bottom-color: ${theme.formatterColor.Darkblue};
      border-bottom-width: 1px;
      border-radius: 20px;
    `}
`;

export const Trend = styled.View<ContainerProps>`
  background-color: ${({ theme }) => theme.colors.White};
  margin: 0 9px 0 4px;
  height: 28px;
  width: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 28px;
`;

export const Name = styled.Text<ContainerProps>`
  margin-left: 13px;
  font-family: 'Inter_400Regular';
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 22px;
  color: ${({ theme, isActive }) => (isActive ? theme.colors.Darkblue : theme.colors.White)};
  opacity: 0.8;
  flex: 1;
`;

export const Percent = styled.Text<ContainerProps>`
  margin-left: 7px;
  font-family: 'Inter_400Regular';
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme, isActive }) => (isActive ? theme.colors.Darkblue : theme.colors.White)};
  opacity: 0.8;
`;

export const Symbol = styled.Text<ContainerProps>`
  font-family: 'Inter_700Bold';
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 22px;
  color: ${({ theme, isActive }) => (isActive ? theme.colors.Darkblue : theme.colors.White)};
`;

export const Price = styled.Text<ContainerProps>`
  margin-left: 7px;
  font-family: 'Inter_700Bold';
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 22px;
  color: ${({ theme, isActive }) => (isActive ? theme.colors.Darkblue : theme.colors.White)};
`;

export const Left = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  flex: 1;
`;

export const Right = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
