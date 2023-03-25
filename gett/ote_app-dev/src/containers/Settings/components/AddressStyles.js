import { StyleSheet } from 'react-native';
import { color } from 'theme';

export default theme => StyleSheet.create({
  flex: {
    flex: 1
  },
  formWrapper: {
    backgroundColor: theme.color.bgPrimary,
    paddingTop: 20
  },
  addressListContainer: {
    backgroundColor: theme.color.bgPrimary,
    paddingTop: 10
  },
  containerGrey: {
    backgroundColor: color.bgSecondary
  },
  predefinedAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15
  },
  addressWrapper: {
    marginLeft: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.color.pixelLine,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  predefinedAddressWrapper: {
    alignSelf: 'stretch'
  },
  addressName: {
    color: theme.color.primaryText,
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5
  },
  predefinedAddressName: {
    width: 60,
    marginBottom: 0
  },
  chevronIcon: {
    paddingHorizontal: 20
  },
  addressValue: {
    color: color.secondaryText,
    fontSize: 17
  },
  input: {
    fontSize: 17
  },
  inputContainer: {
    marginLeft: 15,
    marginBottom: 15,
    marginTop: 5,
    paddingTop: 8
  },
  lastItem: {
    marginBottom: 0
  },
  clearIcon: {
    marginRight: 8
  },
  submitBtn: {
    backgroundColor: color.primaryBtns,
    borderRadius: 0,
    alignSelf: 'stretch'
  },
  submitBtnText: {
    color: color.white,
    fontSize: 18,
    fontWeight: 'bold'
  },
  buttonView: {
    paddingHorizontal: 15,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.color.pixelLine
  },
  buttonText: {
    color: color.white,
    fontSize: 14
  },
  buttonIcon: {
    marginLeft: 11
  },
  deleteButton: {
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 16,
    backgroundColor: theme.color.bgPrimary
  },
  deleteLabel: {
    fontSize: 17,
    color: color.danger
  },
  tip: {
    color: theme.color.secondaryText,
    fontSize: 15,
    flex: 1,
    textAlign: 'center',
    margin: 24,
    opacity: 0.6
  }
});
