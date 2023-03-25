import { SectionList } from 'react-native';
import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

type ListItemType = { text: string, value: string };

export type ListDataType = {
  title: string;
  data: ListItemType[];
};

export enum AvatarSize {
  Big = 30,
  Small = 18,
}

export const Wrapper = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.White};
`;

export const Btn = styled.View`
  padding: 0 16px;
`;

export const Row = styled.View<{ marginTop?: number }>`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: ${({ marginTop }) => marginTop || 0}px;
`;

export const CompanyName = styled.Text`
    font-weight: 900;
    font-size: 36px;
`;

export const Logo = styled.Image`
    width: 30px;
    height: 30px;
`;

export const InStacks = styled.Text`
    margin-left: 6px;
    font-size: 14px;
    text-decoration-line: underline;
    color: ${({ theme }): string => theme.colors.GreyGull};
`;

export const HalfWidth = styled.View`
    flex-direction: row;
    align-items: center;
`;

export const AvatarsContainer = styled.View<{ size: AvatarSize }>`
    flex-direction: row-reverse;
    width: ${({ size }) => size * 2}px;
    height: ${({ size }) => size}px;
`;

export const Avatar = styled(FastImage)<{ size: AvatarSize }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: ${({ size }) => size / 2}px;
  border-width: 1px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.White};
  margin-left: ${({ size }) => -size / 2}px;
`;

export const ChartWrapper = styled.View`
  width: 100%;
  height: 342px;
  margin-top: 26px;
  overflow: hidden;
`;

export const List = styled(SectionList as new() => SectionList<ListItemType, ListDataType>)`
  flex: 1;
  margin: 17px;
  background-color: ${({ theme }) => theme.colors.White};
`;

export const Group = styled.Text`
    margin-top: 31px;
    font-weight: 800;
    font-size: 20px;
`;

export const Item = styled.View`
    flex-direction: row;
    justify-content: space-between;
    padding: 6px 0;
`;

export const ItemTitle = styled.Text`
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.Grey800};
`;

export const ItemData = styled.Text`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.Grey800};
`;
