import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const Wrapper = styled.View`
  flex: 1;
  width: 100%;
  height: 100%;
  background-color: #E2E8F0;
`;

export const Content = styled(SafeAreaView)`
  flex: 1;
  overflow: hidden;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-content: center;
  padding-bottom: 20px;
`;
