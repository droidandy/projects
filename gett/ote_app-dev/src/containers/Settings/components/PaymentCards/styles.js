import { PixelRatio, StyleSheet } from 'react-native';
import { color } from 'theme';

export default theme => StyleSheet.create({
  flex: {
    flex: 1
  },
  bg: {
    backgroundColor: theme.color.bgSecondary
  },
  viewItemDetails: {
    flexDirection: 'column'
  },
  viewItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  listItem: {
    paddingHorizontal: 0
  },
  container: {
    backgroundColor: theme.color.bgPrimary
  },
  paymentView: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 10
  },
  deactivateBtn: {
    marginTop: 30,
    paddingVertical: 18,
    backgroundColor: theme.color.bgPrimary
  },
  deactivateBtnLabel: {
    textAlign: 'center',
    color: color.danger,
    fontSize: 17
  },
  deactivateBtnLabelDisabled: {
    textAlign: 'center',
    color: theme.color.disabledLink,
    fontSize: 17
  },
  block: {
    backgroundColor: theme.color.bgPrimary,
    borderBottomWidth: theme.isNightMode ? 0 : PixelRatio.get() * StyleSheet.hairlineWidth,
    borderBottomColor: theme.color.pixelLine
  },
  paymentCardLabel: {
    fontSize: 14,
    color: theme.color.secondaryText,
    marginVertical: 3
  },
  paymentCardText: {
    color: theme.color.primaryText,
    fontSize: 17
  },
  chevronIcon: {
    paddingHorizontal: 20
  },
  checkIcon: {
    paddingRight: 40,
    paddingLeft: 20
  },
  paymentText: {
    color: theme.color.secondaryText,
    fontSize: 17,
    marginHorizontal: 3
  },
  paymentTextPrimary: {
    color: theme.color.primaryText,
    fontSize: 17,
    marginHorizontal: 3
  },
  input: {
    fontSize: 17,
    paddingVertical: 17
  },
  commonContainer: {
    marginLeft: 15
  },
  paymentWrapper: {
    paddingTop: 5,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center'
  },
  paymentCardWrapper: {
    marginBottom: 15,
    marginTop: 5,
    paddingTop: 8
  },
  inputContainer: {
    marginTop: 8,
    marginLeft: 15
  },
  error: {
    marginLeft: 0,
    paddingLeft: 0
  },
  inputLabel: {
    marginTop: 8
  },
  helpIcon: {
    marginRight: 16
  },
  clearIcon: {
    marginRight: 20
  },
  infoView: {
    marginTop: 18,
    marginBottom: 41,
    marginHorizontal: 16
  },
  infoUnderView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  infoLabel: {
    color: theme.color.primaryText,
    fontSize: 22,
    marginBottom: 10
  },
  infoText: {
    color: theme.color.secondaryText,
    fontSize: 17,
    flex: 1,
    marginRight: 25
  },
  checkboxWrapper: {
    marginHorizontal: 12
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
    color: theme.color.white,
    fontSize: 14
  }
});
