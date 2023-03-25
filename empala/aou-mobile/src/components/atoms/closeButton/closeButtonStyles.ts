import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity<{lightMode: boolean | undefined}>`
  background-color: ${({ theme, lightMode }) => lightMode ? theme.formatterColor.ModalBackground : theme.formatterColor.Light200};
  width: 40px;
  height: 40px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
`;
