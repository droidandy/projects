import styled, { css } from 'styled-components/native';

interface TabProps {
  readonly isActive: boolean;
}

export const Container = styled.ScrollView`
  flex-grow: 0;
`;

export const View = styled.View<TabProps>`
  padding: 12px 14px;
  ${({ theme, isActive }) => isActive
    && css`
      border-radius: 120px;
      background-color: ${theme.formatterColor.Light200};
    `}
`;

export const Text = styled.Text<TabProps>`
  font-family: 'Inter_700Bold';
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.White};
  opacity: ${({ isActive }) => (isActive ? 1 : 0.8)};
`;
