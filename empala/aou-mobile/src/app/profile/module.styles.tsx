import { Dimensions, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

type ListItemType = { text: string };

export type ListDataType = {
  title: string;
  data: ListItemType[];
};

const fullHeight = Dimensions.get('window').height;

const headerRadius = 16;
const loaderContainerSize = 180;

export const SafeArea = styled(SafeAreaView)`
  background-color: ${({ theme }) => theme.colors.White};
  flex: 1;
`;

export const BlueSafeArea = styled(SafeArea)`
    background-color: ${({ theme }) => theme.colors.Grey200};
`;

export const OverscrollBackground = styled.View`
  background-color: ${({ theme }) => theme.colors.BrandBlue200};
  height: ${`${fullHeight}px`};
  position: absolute;
  top: ${`${-fullHeight}px`};
  left: 0;
  right: 0;
`;

export const List = styled(SectionList as new() => SectionList<ListItemType, ListDataType>)`
  flex: 1;
`;

export const ListHeader = styled.View`
  flex: 1;
`;

export const GroupHeader = styled.Text<{ first?: boolean }>`
  padding: 36px 16px 17px;

  font-weight: 500;
  font-size: 18px;
  color: ${({ theme }) => theme.formatterColor.Dark400};
  background-color: ${({ theme }) => theme.colors.Grey200};
`;

export const HeaderBackground = styled.View<{ headerHeight: number }>`
    height: ${({ headerHeight }) => (headerHeight + headerRadius)}px;
    width: 100%;
    position: absolute;
    border-bottom-left-radius: ${headerRadius}px;
    border-bottom-right-radius: ${headerRadius}px;
    background-color: ${({ theme }) => theme.colors.BrandBlue200};
`;

export const FeedbackForm = styled.KeyboardAvoidingView<{ visible: boolean }>`
    display: ${({ visible }) => (visible ? 'flex' : 'none')};
    flex: 1;
    padding: 0 16px; 
    margin-top: ${39 + headerRadius}px;
`;

export const FeedbackTitle = styled.Text`
    margin-top: ${39 + headerRadius}px;
    font-size: 22px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.Dark}
`;

export const FeedbackSubTitle = styled.Text`
    margin-top: 11px;
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.formatterColor.Dark800}
`;

export const FeedBackInputContainer = styled.View`
    flex: 1;
    margin-top: 36px;
    border-radius: 36px;
    background-color: ${({ theme }) => theme.formatterColor.Dark50};
`;

export const FeedbackInput = styled.TextInput`
    padding: ${headerRadius}px;
    color: ${({ theme }) => theme.formatterColor.Dark800};
`;

export const LoaderContainer = styled.View`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    justify-content: center;
    align-items: center;
`;

export const LoaderBackground = styled.View`
    width: ${loaderContainerSize}px;
    height: ${loaderContainerSize}px;
    border-radius: ${loaderContainerSize / 2}px;
    background-color: ${({ theme }) => theme.colors.White};
`;

export const Btn = styled.View`
  flex-shrink: 1;
  justify-content: flex-end;
  margin: 17px 0;
`;
