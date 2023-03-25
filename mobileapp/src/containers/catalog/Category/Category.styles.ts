import { StyleSheet } from 'react-native';

import { theme } from '../../../helpers/theme';

export const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  subCategory: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: theme.sizing(6),
    paddingHorizontal: theme.sizing(1),
    fontFamily: theme.fonts.light,
    fontSize: 16,
    fontWeight: '300',
    color: theme.grayText,
  },
  subCategoryText: {
    flex: 1,
  },
  subCategoryChevron: {
    flexShrink: 0,
  },
  noData: {
    color: theme.green,
    fontSize: 18,
  },
  chunk: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  chunkWord: {
    flexShrink: 0,
    marginRight: theme.sizing(1),
    height: theme.sizing(6),
    justifyContent: 'center',
  },
  chunkWordText: {
    fontSize: 20,
    color: theme.gray,
    fontWeight: '600',
  },
  chunkItems: {
    flex: 1,
  },
});
