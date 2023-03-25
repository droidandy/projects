import styled from 'styled-components/native';

import { Icon } from '~/components/atoms/icon';

export const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

export const Content = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  padding-top: 46px;
  padding-bottom: 46px;
  z-index: 2;
`;

export const Bottom = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: -50px;
  z-index: 1;
  align-self: flex-end;
`;

export const Cover = styled(Icon)`
  z-index: 1;
`;

export const Layout = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background-color: #00c0a980;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

export const Label = styled.Text`
  font-family: 'Baloo2_700Bold';
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 36px;
  color: #ffffff;
  text-align: center;
`;

export const TextContainer = styled.View`
  margin-bottom: 62px;
`;

export const Control = styled.TouchableOpacity`
  position: absolute;
  left: 0;
  right: 0;
  top: -25%;
  align-items: center;
  z-index: 2;
`;

export const ButtonsContainer = styled.View`
  height: ${`${56 + 56 + 16}px`};
  justify-content: space-between;
  padding: 0 16px;
`;
