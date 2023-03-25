import { StyleSheet } from 'react-native';
import { deviceWidth } from 'utils';
import { color } from 'theme';

export default StyleSheet.create({
  container: {
    padding: 16,
    width: '100%',
    position: 'absolute',
    left: 0,
    zIndex: 99,
    elevation: 10
  },
  containertop: {
    top: 0
  },
  containerbottom: {
    bottom: 0
  },
  messageContainer: {
    width: deviceWidth - 32,
    minHeight: 70,
    elevation: 2,
    shadowColor: color.black,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      height: 0
    },
    borderRadius: 10,
    padding: 16,
    paddingRight: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  messageContainerwarning: {
    backgroundColor: color.primaryBtns
  },
  messageContainerinfo: {
    backgroundColor: color.link
  },
  messageContainersuccess: {
    backgroundColor: color.success
  },
  messageContainerfailed: {
    backgroundColor: color.danger
  },
  message: {
    fontSize: 14,
    flex: 1,
    paddingHorizontal: 16
  },
  title: {
    color: color.white,
    fontWeight: '900'
  },
  description: {
    color: color.white
  },
  icon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
