import styled, { css } from 'styled-components/native';

interface ContainerProps {
  readonly focus: boolean;
}

export const Container = styled.View`
  flex: 1;
  margin: 4px 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

export const Close = styled.TouchableOpacity`
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const InputContainer = styled.View<ContainerProps>`
  height: 56px;
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.formatterColor.Darkblue};
  border-radius: 120px;
  margin-right: 8px;
  padding: 0 17px;
  ${({ theme, focus }) => focus
          && css`
      background: ${theme.formatterColor.Dark400};
      border-color: ${theme.formatterColor.Darkblue};
      border-width: 2px;
    `}
`;

export const Input = styled.TextInput`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 18px;
  font-family: Inter_500Medium;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.White};
`;
