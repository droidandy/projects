import { StyleSheet } from 'react-native';
import { theme } from '../../helpers/theme';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  right: {
    position: 'relative',
    flexShrink: 0,
  },
  like: {
    position: 'absolute',
    zIndex: 10,
    margin: theme.sizing(-1),
  },
  likeButton: {
    padding: theme.sizing(1),
  },
  image: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: theme.sizing(12),
    height: theme.sizing(12),
    marginBottom: theme.sizing(2),
  },
  productImage: {
    width: theme.sizing(11),
    height: theme.sizing(11),
  },
  discountTag: {
    position: 'absolute',
    zIndex: 10,
    marginTop: theme.sizing(10),
  },
  left: {
    flexShrink: 1,
    paddingLeft: theme.sizing(2),
    width: '100%',
  },
  nameText: {
    fontSize: 16,
    color: theme.darkGray,
  },
  price: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: theme.sizing(1.5),
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
});
