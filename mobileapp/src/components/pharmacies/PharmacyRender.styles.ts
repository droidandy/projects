import { StyleSheet } from 'react-native';
import { theme } from '../../helpers/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flex: 1,
  },
  info: {
    flex: 1,
  },
  infoTitle: {
    flex: 1,
  },
  infoTitleText: {
    fontSize: 14,
  },
  infoAddress: {
    flex: 1,
  },
  infoAddressText: {
    fontSize: 12,
    color: theme.gray,
  },
  metro: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.sizing(1),
    flex: 1,
  },
  metroIcon: {
    marginRight: theme.sizing(0.5),
  },
  metroText: {
    fontSize: 12,
    color: theme.gray,
  },
  phone: {
    marginTop: theme.sizing(1),
  },
  phoneText: {
    fontSize: 12,
    color: theme.green,
  },
  right: {
    flex: 0,
  },
});
