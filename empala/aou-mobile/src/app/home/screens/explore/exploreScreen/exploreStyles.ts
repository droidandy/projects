import styled from 'styled-components/native';

export const SafeArea = styled.SafeAreaView`
 flex: 1;
`;

export const Divider = styled.View`
  height: 100%;
  width: 14px;
`;

export const List = styled.SectionList`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.Grey200};
`;

export const FlatList = styled.FlatList.attrs(({ theme }) => ({
  contentContainerStyle: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.Grey200,
  },
}))`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.Grey200};
`;

export const Card = styled.View`
  padding: 10px;
`;
