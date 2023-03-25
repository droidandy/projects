import styled from 'styled-components/native';

export const Wrapper = styled.View`
  margin-top: 35px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
`;

export const HeaderLabel = styled.Text`
  color: ${({ theme }): string => theme.colors.Black};
  font-weight: 800;
  font-size: 20px;
  line-height: 30px;
`;

export const ListWrapper = styled.View`
  width: 100%;
  z-index: 0;
`;
