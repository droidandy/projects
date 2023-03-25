import styled from 'styled-components/native';

export const Wrapper = styled.View`
  width: 100%;
  padding-bottom: 37px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderLabel = styled.Text<{ debug?: boolean }>`
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
  color: ${({ theme, debug }): string => (debug ? theme.colors.Black : theme.colors.White)};
`;

export const HeaderArrow = styled.TouchableOpacity``;

export const Content = styled.View`
  margin-top: 16px;
`;
