import { LinearGradient } from 'expo-linear-gradient';
import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const SafeArea = styled(SafeAreaView)`
 flex: 1;
 width: 100%;
`;

export const GradientLayerInner = styled(LinearGradient).attrs(({ theme }) => ({
  start: { x: 0.8, y: 0 },
  end: { x: 0.3, y: 1 },
  colors: [theme.colors.Green200, theme.colors.Greenish],
}))`
  width: 100%;
  height: 100%;
  align-self: center;
  justify-content: center;
  align-items: center;
  background-color: transparent;
`;

export const FlatList = styled.FlatList.attrs(() => ({
  contentContainerStyle: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16,
  },
}))`
`;

export const Card = styled.View`
  flex-direction: row;
  align-items: center;
  height: 64px;
  width: 100%;
`;

export const Title = styled.Text`
  padding-left: 14px;
  font-family: 'Baloo2_700Bold';
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  color: #ffffff;
`;

export const Content = styled.View`
  margin-top: 88px;
  flex: 1;
  width: 100%;
`;

export const HeaderIconsContent = styled.View`
  flex-direction: row;
`;

export const Label = styled.Text`
  font-family: 'Baloo2_700Bold';
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 32px;
  color: ${({ theme }) => theme.colors.White};
  text-align: center;
`;

export const TextInputContainer = styled.View`
    align-items: center;
    width: 100%;
    margin-top: 32px;
    margin-bottom: 32px;
    padding-left: 16px;
    padding-right: 16px;
`;

export const Avatar = styled(FastImage)`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  overflow: hidden;
  background-color: #fff;
`;

export const BtnWrapper = styled.View`
  flex: 1;
`;
export const Btn = styled.View`
  flex-direction: row;
  margin: 7px 0;
  z-index: 2;
  padding: 0 20px;
`;

export const Row = styled.View`
  width: 100%;
  padding: 4px 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ButtonContainer = styled.View`
flex: 1;
align-items: flex-end;
`;

export const Separator = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.formatterColor.Light200};
`;
