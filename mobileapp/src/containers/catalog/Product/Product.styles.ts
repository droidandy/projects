import { StyleSheet } from 'react-native';

import { theme } from '../../../helpers/theme';

export const styles = StyleSheet.create({
  content: {
    paddingVertical: theme.screenPadding.vertical,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  common: {
    flexDirection: 'row',
    flex: 1,
  },
  commonRight: {
    flex: 1,
    marginLeft: theme.sizing(2),
  },
  noData: {
    color: theme.green,
    fontSize: 18,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: theme.fonts.productHeading,
  },
  price: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: theme.sizing(2),
  },
  priceCurrent: {
    flex: 1,
  },
  priceOld: {
    flex: 1,
  },
  priceCurrentText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    color: theme.green,
  },
  priceDiscountText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    color: theme.red,
  },
  priceOldText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'left',
    color: theme.grayedGreen,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  outOfStock: {
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.sizing(1.5),
  },
  outOfStockIcon: {
    width: theme.sizing(2),
    height: theme.sizing(2),
  },
  outOfStockText: {
    fontSize: 12,
    color: theme.lightGray,
  },
  buttons: {
    marginTop: theme.sizing(2),
    alignItems: 'flex-end',
  },
  button: {
    width: 160,
  },
  vendorCode: {
    marginTop: theme.sizing(4),
    width: '100%',
    alignItems: 'flex-start',
  },
  vendorCodeText: {
    fontSize: 14,
    color: theme.gray,
  },
  param: {
    width: '100%',
    marginTop: theme.sizing(2),
  },
  paramLabel: {
    fontSize: 18,
    color: theme.grayText,
  },
  paramValue: {
    marginTop: theme.sizing(0.5),
    fontSize: 14,
    color: theme.gray,
  },
  paramActiveIngredients: {
    marginTop: theme.sizing(0.5),
    fontSize: 14,
    color: theme.green,
  },
  descriptionTitle: {
    width: '100%',
    marginTop: theme.sizing(4),
  },
});
