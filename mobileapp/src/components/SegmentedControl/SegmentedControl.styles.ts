import { StyleSheet } from 'react-native';

import { theme } from '../../helpers/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.green,
    padding: StyleSheet.hairlineWidth,
    borderRadius: 6,
  },
  segment: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.sizing(0.5),
    paddingHorizontal: theme.sizing(1),
    backgroundColor: '#fff',
    marginRight: StyleSheet.hairlineWidth,
  },
  segmentFirst: {
    borderTopLeftRadius: 5.5,
    borderBottomLeftRadius: 5.5,
  },
  segmentLast: {
    borderTopRightRadius: 5.5,
    borderBottomRightRadius: 5.5,
    marginRight: 0,
  },
  segmentText: {
    color: theme.green,
    fontSize: 14,
  },
  segmentActive: {
    backgroundColor: theme.green,
  },
  segmentActiveText: {
    color: '#fff',
    fontSize: 14,
  },
});
