import styled from 'styled-components/native';

export const Wrapper = styled.View`
  min-height: 80px;
  background-color: ${({ theme }) => theme.colors.Green200};
  margin: 0 0 19px 0;
`;

export const Container = styled.View`
  flex: 1;
  margin: 8px 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

export const InputContainer = styled.View`
  height: 56px;
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.formatterColor.Dark200};
  border-radius: 8px;
  padding: 20px 16px;
`;

export const Input = styled.TextInput`
  flex: 1;
  font-family: Inter_400Regular;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.White};
`;
