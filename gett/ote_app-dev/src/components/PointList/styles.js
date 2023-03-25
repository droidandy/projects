import { StyleSheet } from 'react-native';

export default theme => StyleSheet.create({
  flex: {
    flex: 1
  },
  wrapper: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    backgroundColor: theme.color.bgPrimary,
    marginVertical: 12,
    marginHorizontal: 12
  },
  rowWrapper: {
    height: 34,
    justifyContent: 'center'
  },
  row: {
    flexDirection: 'row',
    marginVertical: 0,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center'
  },
  connector: {
    position: 'absolute',
    left: 0,
    height: 18,
    flexDirection: 'row',
    alignItems: 'center'
  },
  editIcon: {
    marginLeft: 10
  },
  pickUpIcon: {
    marginRight: 15
  },
  stopIcon: {
    marginLeft: 1,
    marginRight: 16
  },
  pickUpText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 16,
    color: theme.color.primaryText
  },
  selectDestinationText: {
    flex: 1,
    color: theme.color.secondaryText,
    fontSize: 15,
    lineHeight: 16
  },
  addStopText: {
    flex: 1,
    justifyContent: 'center',
    fontSize: 15,
    color: theme.color.primaryText
  },
  addStopLink: {
    color: theme.color.link
  },
  addressWrapper: {
    flex: 1,
    height: 34,
    paddingVertical: 8
  },
  separator: {
    height: 1,
    width: '100%',
    marginTop: 8
  }
});
