import { StyleSheet } from 'react-native';

export default theme => StyleSheet.create({
  passwordInputWrapper: {
    marginLeft: 16,
    marginBottom: 10
  },
  passwordInput: {
    paddingRight: 8
  },
  passwordInputError: {
    marginBottom: -7
  },
  touchBtn: {
    width: 50,
    marginLeft: 10,
    paddingHorizontal: 0
  },
  popupIcon: {
    alignSelf: 'center',
    marginBottom: 24
  },
  popupTitle: {
    color: theme.color.primaryText,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15
  },
  popupSubTitle: {
    color: theme.color.secondaryText,
    fontSize: 17,
    textAlign: 'center'
  },
  popupCaution: {
    color: theme.color.secondaryText,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 34,
    marginBottom: 24
  },
  popupSuccessIcon: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    backgroundColor: theme.color.bgPrimary,
    overflow: 'hidden',
    borderRadius: 10
  }
});
