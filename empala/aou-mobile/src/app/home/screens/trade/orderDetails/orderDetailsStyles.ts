import styled from 'styled-components/native';

export const ScrollWrapper = styled.ScrollView`
  width: 100%;
`;

export const HeaderContainer = styled.View`
  margin-top: 32px;
  margin-bottom: 56px;
`;

export const FooterContainer = styled.View`
  height: 16px;
`;

export const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.Text`
  font-family: 'Inter_800ExtraBold';
  font-size: 18px;
`;

export const TitleGrey = styled.Text`
  color: ${({ theme }): string => theme.colors.GreyGull};
`;

export const SubTitle = styled.Text`
  font-family: 'Inter_800ExtraBold';
  font-size: 48px;
  line-height: 60px;
  padding-top: 20px;
`;

export const NoteContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const NoteTitle = styled.Text`
  font-family: 'Inter_400Regular';
  font-size: 11px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.GreyGull};
`;

export const Separator = styled.View`
  height: 1px;
  background-color: black;
  opacity: 0.2;
`;

export const ItemContainer = styled.View`
  height: 36px;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

export const ItemText = styled.Text`
  font-family: 'Inter_400Regular';
  font-size: 16px;
  line-height: 24px;
`;

export const ItemValue = styled.Text`
  font-family: 'Inter_700Bold';
  font-size: 16px;
  line-height: 24px;
`;

export const FlatList = styled.FlatList.attrs(() => ({
  contentContainerStyle: { paddingHorizontal: 16, backgroundColor: 'white' },
}))`
  width: 100%;
`;

export const Btn = styled.View`
  margin-top: 58px;
  padding: 0 16px;
`;
