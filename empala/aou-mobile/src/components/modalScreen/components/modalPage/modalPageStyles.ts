import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: transparent;
`;

export const CloseOverlay = styled.TouchableOpacity`
  flex: 1;
  width: 100%;
`;

export const SafeAreaContainer = styled(SafeAreaView)`
  width: 100%;
  background-color: ${({ theme }) => theme.formatterColor.ModalBackground};
`;

export const HeaderContainer = styled.View`
  flex-direction: row;
  width: 100%;
  background-color: ${({ theme }) => theme.formatterColor.ModalBackground};
  padding-top: 39px;
  padding-bottom: 21px;
  padding-left: 20px;
  padding-right: 20px;
  border-top-left-radius: 36px;
  border-top-right-radius: 36px;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderTitle = styled.Text`
  font-family: 'Baloo2_700Bold';
  font-size: 22px;
  font-weight: 700;
  text-align: left;
  color: white;
`;
