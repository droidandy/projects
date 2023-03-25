import styled from 'styled-components/native';

export const Wrapper = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 12px 8px 8px;
  background-color: ${({ theme }) => theme.formatterColor.Light200};
  border-radius: 32px;
  min-width: 68px;
  height: 40px;
  margin: 8px;
  overflow: hidden;
`;

export const Count = styled.Text`
  padding-left: 8px;
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.White};
`;
