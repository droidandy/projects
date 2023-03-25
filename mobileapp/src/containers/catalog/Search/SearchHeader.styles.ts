import { StyleSheet } from 'react-native';
import { theme } from '../../../helpers/theme';

export const headerDimensionsWidth = (width: number): { headerWidth: { width: number } } =>
  StyleSheet.create({ headerWidth: { width: width - theme.sizing(6) } });

export const headerStyles = StyleSheet.create({
  header: {
    flex: 0,
    height: 36,
    margin: theme.screenPadding.space,
    marginLeft: theme.sizing(6),
  },
  headerInput: {
    marginRight: theme.sizing(1),
  },
  headerInputIcon: {
    flexShrink: 0,
    width: theme.sizing(2),
    height: theme.sizing(2),
    margin: theme.sizing(1),
  },
  headerClearIcon: {
    flexShrink: 0,
    width: theme.sizing(3),
    height: theme.sizing(3),
    margin: theme.sizing(1),
  },
  headerLinks: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerLink: {
    padding: theme.sizing(1),
  },
  headerLinkIcon: {
    width: theme.sizing(2),
    height: theme.sizing(2),
    marginRight: theme.sizing(0.5),
  },
  headerLinkLocIcon: {
    width: theme.sizing(2),
    height: theme.sizing(2),
    padding: theme.sizing(1),
    marginRight: theme.sizing(0.25),
  },
  headerLinkText: {
    fontSize: 16,
  },
  headerLinkChevronIcon: {
    width: theme.sizing(3),
    height: theme.sizing(3),
    padding: 0,
    marginLeft: theme.sizing(1),
  },
});
