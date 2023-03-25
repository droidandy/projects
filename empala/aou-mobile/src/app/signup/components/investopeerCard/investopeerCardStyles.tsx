import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';

export const Container = styled.View`
  display: flex;
  width: 252px;
  height: 220px;
  justify-content: flex-start;
  border-radius: 16px;
  background-color: #1a4591;
  overflow: hidden;
  margin: 10px;
`;

export const Top = styled.View`
  display: flex;
  flex-direction: row;
  padding: 15px;
`;

export const Bottom = styled.View`
  background-color: #ffffff;
  flex: 1;
  justify-content: space-between;
  padding: 10px 16px;
`;

export const Middle = styled.View`
  background-color: #f4f7fa;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 16px;
  height: 52px;
`;

export const Name = styled.Text`
  font-family: 'Baloo2_700Bold';
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 32px;
  color: #ffffff;
`;

export const UserName = styled.Text`
  font-family: 'Baloo2_700Bold';
  font-style: normal;
  font-weight: bold;
  font-size: 15px;
  line-height: 18px;
  color: #ffffff;
  opacity: 0.8;
`;

export const Label = styled.Text`
  font-family: 'Inter_400Regular';
  font-style: normal;
  font-weight: normal;
  font-size: 11px;
  text-align: center;
  color: #607d9e;
`;

export const Details = styled(Label)`
  margin: 7px 16px 26px 16px;
`;

export const Count = styled.Text`
  font-family: 'Inter_700Bold';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  color: #607d9e;
`;

export const Block = styled.View``;

export const Avatar = styled(FastImage)`
  width: 57px;
  height: 57px;
  border-radius: 28px;
  overflow: hidden;
  background-color: #fff;
`;

export const Names = styled.View`
  flex: 1;
  padding: 0 16px;
  justify-content: center;
`;
