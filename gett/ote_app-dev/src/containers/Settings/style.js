import { StyleSheet } from 'react-native';
import { color } from 'theme';

export default theme => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bgSecondary
  },
  blockItems: {
    marginBottom: 20,
    backgroundColor: theme.color.bgPrimary
  },
  listItem: {
    flexDirection: 'row',
    minHeight: 56,
    paddingLeft: 19,
    paddingRight: 14
  },
  listItemHolder: {
    flex: 1,
    alignSelf: 'stretch'
  },
  listItemWrapper: {
    flex: 1,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  listItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  divider: {
    marginRight: -14
  },
  title: {
    fontSize: 17,
    color: theme.color.primaryText
  },
  rightTitle: {
    flex: 1,
    textAlign: 'right',
    marginLeft: 20,
    fontSize: 17,
    color: theme.color.secondaryText
  },
  icon: {
    marginRight: 14,
    alignSelf: 'center'
  },
  avatar: {
    marginVertical: 10,
    marginRight: 14
  },
  chevron: {
    marginLeft: 14
  },
  emptyChevron: {
    marginLeft: 24
  },
  themeModeModal: {
    width: '100%'
  },
  appVersion: {
    alignItems: 'center',
    marginVertical: 10
  },
  appVersionText: {
    fontSize: 12,
    lineHeight: 28,
    color: color.secondaryText
  },
  logoutBtn: {
    backgroundColor: theme.color.bgPrimary,
    height: 56,
    justifyContent: 'center'
  },
  logoutText: {
    fontSize: 17,
    textAlign: 'center',
    color: color.danger,
    fontWeight: '600'
  }
});
