import { StyleSheet } from 'react-native';

export default theme => StyleSheet.create({
  flex: {
    flex: 1
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingRight: 30
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    color: theme.color.primaryText,
    fontSize: 17
  },
  subTitle: {
    fontSize: 14,
    color: theme.color.secondaryText,
    marginTop: 4
  },
  avatar: {
    marginRight: 9
  },
  viewSelected: {
    marginRight: 20
  },
  itemWithAvatar: {
    height: 67
  }
});
