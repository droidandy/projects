import styled, { css } from 'styled-components/native';

export type InputFace = 'primary' | 'secondary';

interface ContainerProps {
  readonly focus: boolean;
}

export const Wrapper = styled.View`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 8px;
  margin-bottom: 8px;
`;

export const Container = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
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
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 5px 0 5px;
  font-family: Inter_500Medium;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.White};
  text-align: center;
`;

export const Btn = styled.TouchableOpacity`
  margin: 0 3px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Label = styled.Text<{ face?: InputFace }>`
  margin: 0 5px 0 5px;
  font-family: Inter_500Medium;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.White};
  text-align: center;
  ${({ face }) => face === 'primary'
          && css`
      text-align: left;
      max-width: 120px;
    `}
`;

export const Error = styled.View`
  margin: 4px 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 120px;
  padding: 0 17px;
  width: 100%;
  background: ${({ theme }) => theme.colors.Red};
`;

export const ErrorText = styled.Text`
  margin: 5px;
  font-family: Inter_400Regular;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.White};
  text-align: center;
`;
