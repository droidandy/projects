import { StyleSheet } from 'react-native';

import { theme } from '../../../helpers/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingVertical: theme.sizing(3),
  },

  orderTotal: {
    paddingTop: theme.sizing(2),
  },
  amountPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexGrow: 1,
    flexShrink: 0,
    marginBottom: theme.sizing(1),
  },
  left: {
    marginHorizontal: theme.sizing(0.5),
  },
  right: {
    marginHorizontal: theme.sizing(0.5),
  },
  orderAmount: {
    fontSize: 16,
    color: theme.grayedGreen,
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: 16,
    color: theme.green,
    fontWeight: 'bold',
  },

  orderStatus: {
    fontSize: 16,
    color: theme.grayedGreen,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonActions: {
    marginTop: theme.sizing(1),
  },
});
