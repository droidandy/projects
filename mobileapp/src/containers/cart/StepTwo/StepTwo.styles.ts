import { StyleSheet } from 'react-native';

import { theme } from '../../../helpers/theme';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexGrow: 1,
    flexShrink: 0,
    marginVertical: theme.sizing(1),
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

  containerScroll: {
    flex: 1,
    marginBottom: theme.sizing(3),
  },
  order: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.sizing(1),
  },
  orderText: {
    fontFamily: theme.fonts.productHeading,
    fontSize: 20,
    color: theme.green,
    fontWeight: '800',
  },
  orderNumber: {
    marginTop: theme.sizing(3),
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.green,
    borderRadius: theme.sizing(1),
    paddingVertical: theme.sizing(1),
    paddingHorizontal: theme.sizing(3),
  },
  pharmacy: {
    height: theme.sizing(18),
    flexShrink: 0,
  },
  pharmacyWithPhone: {
    height: theme.sizing(20),
    flexShrink: 0,
  },
  orderTotal: {
    flexShrink: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: theme.sizing(1),
  },
  orderTotalLabel: {
    marginHorizontal: theme.sizing(0.5),
    fontFamily: theme.fonts.productHeading,
    fontSize: 20,
    color: theme.gray,
    fontWeight: '800',
  },
  orderTotalSum: {
    fontFamily: theme.fonts.productHeading,
    fontSize: 20,
    color: theme.green,
    fontWeight: '800',
  },
});
