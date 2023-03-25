import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { Icon } from '~/components/atoms/icon';
import layout from '~/constants/Layout';

const marginTop = layout.height * 0.2;

export const Slide = styled(SafeAreaView)`
  flex: 1;
  justify-content: center;
`;

export const Container = styled.View({
  flexGrow: 1,
  alignItems: 'center',
  marginTop,
});

export const Image = styled(Icon).attrs(({ imageWidth }: { imageWidth: number }) => ({
  size: layout.width * imageWidth,
}))<{ imageWidth: number }>({});

export const Btn = styled.View`
  margin: 7px 0;
  z-index: 2;
  padding: 0 16px;
`;

export const Label = styled.Text`
  font-family: 'Baloo2_700Bold';
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 32px;
  color: #ffffff;
  text-align: center;
`;

export const Text = styled.Text`
  margin-top: 25px;
  font-family: 'Inter_500Medium';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: #ffffff;
  opacity: 0.7;
  margin-left: 16px;
  margin-right: 16px;
`;
