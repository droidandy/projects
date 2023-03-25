import { StyleSheet } from 'react-native';

import { theme } from '../../helpers/theme';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  left: {
    position: 'relative',
    flexShrink: 0,
  },
  right: {
    flexShrink: 1,
    paddingLeft: theme.sizing(2),
    width: '100%',
  },
  textRightContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  orderNumber: {
    fontSize: 17,
  },
  dateIns: {
    marginTop: 6,
    color: theme.gray,
    fontSize: 14,
  },
  chevronIcon: {
    flexShrink: 0,
  },
  statusName: {
    marginRight: 12,
    textAlign: 'right',
  },
});
