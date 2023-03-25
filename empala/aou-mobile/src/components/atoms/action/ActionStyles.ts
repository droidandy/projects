import styled from 'styled-components/native';

interface ContainerProps {
  readonly isActive: boolean;
}

export const Container = styled.TouchableOpacity<ContainerProps>`
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.4;
  background: ${({ theme, isActive }) => (isActive ? theme.colors.Darkblue : theme.colors.BrandBlue600)};
  border-radius: 42px;
`;
