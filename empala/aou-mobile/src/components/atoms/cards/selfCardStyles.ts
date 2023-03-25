import FastImage from 'react-native-fast-image';
import styled, { css } from 'styled-components/native';

export const Container = styled.View<{ roundedTop: boolean }>`
  display: flex;
  justify-content: flex-start;
  border-radius: 16px;
  ${({ roundedTop }) => !roundedTop
    && css`
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    `}
  background-color: ${({ theme }) => theme.colors.BrandBlue200};
  overflow: hidden;
`;

export const TouchableContainer = styled.TouchableOpacity<{ roundedTop: boolean }>`
  display: flex;
  justify-content: flex-start;
  border-radius: 16px;
  ${({ roundedTop }) => !roundedTop
    && css`
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    `}
  background-color: ${({ theme }) => theme.colors.BrandBlue200};
  overflow: hidden;
`;

export const Top = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 14px 11px 12px 11px;
`;

export const Middle = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 12px 17px 14px 17px;
`;

export const Name = styled.Text`
  font-family: 'Inter_700Bold';
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 14px;
  color: #ffffff;
`;

export const UserName = styled.Text`
  margin-top: 3px;
  font-family: 'Inter_400Regular';
  font-style: normal;
  font-weight: normal;
  font-size: 11px;
  line-height: 11px;
  color: #ffffff;
  opacity: 0.6;
`;

export const Action = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.formatterColor.Light200};
`;

export const Label = styled.Text`
  font-family: 'Inter_400Regular';
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 16px;
  text-align: center;
  color: #ffffff;
  opacity: 0.4;
`;

export const Count = styled.Text`
  font-family: 'Baloo2_700Bold';
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 32px;
  text-align: left;
  color: #ffffff;
  opacity: 0.6;
`;

export const Block = styled.View`
min-width: 53px;
`;

export const Avatar = styled(FastImage)`
  width: 52px;
  height: 52px;
  border-radius: 28px;
  overflow: hidden;
  background-color: #fff;
`;

export const Names = styled.View`
  flex: 1;
  padding: 0 8px;
  justify-content: center;
`;
