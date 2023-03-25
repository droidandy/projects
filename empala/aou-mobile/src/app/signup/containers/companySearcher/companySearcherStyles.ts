import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { Instrument } from '~/graphQL/core/generated-types';

export const Slide = styled(SafeAreaView)`
  flex: 1;
  justify-content: center;
  padding: 0 16px;
`;

export const SearchBoxContainer = styled.View`
  margin: 40px 0px;
`;

export const List = styled(FlatList as new () => FlatList<Instrument>).attrs(() => ({
  contentContainerStyle: {
    flex: 1,
    marginBottom: 24,
  },
}))`
`;
