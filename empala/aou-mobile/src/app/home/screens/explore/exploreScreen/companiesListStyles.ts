import styled from 'styled-components/native';

export const List = styled.FlatList.attrs(() => ({
  contentContainerStyle: { paddingBottom: 35 },
}))`
  background-color: ${({ theme }) => theme.colors.Grey200};
`;
