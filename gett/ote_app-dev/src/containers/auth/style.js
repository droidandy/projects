import { StyleSheet } from 'react-native';
import { color, formattedColor } from 'theme';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent'
  },

  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    padding: 30
  },

  logo: {
    alignSelf: 'center',
    margin: 30
  },

  input: {
    marginTop: 20
  },

  inputStyle: {
    fontSize: 18,
    color: color.white
  },

  inputContainer: {
    borderBottomColor: formattedColor.white.opacity(0.8)
  },

  label: {
    color: color.white
  },

  footer: {
    width: '100%',
    marginVertical: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },

  footerText: {
    color: color.white,
    fontSize: 16
  },

  btnForgot: {
    marginBottom: 10,
    width: 130,
    alignSelf: 'flex-end'
  },

  forgotText: {
    paddingVertical: 5,
    marginTop: -5,
    textAlign: 'right',
    color: color.white,
    fontSize: 14,
    textDecorationLine: 'underline'
  },

  footerLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    textAlign: 'center'
  },

  errorContainer: {
    marginHorizontal: 20,
    borderRadius: 30,
    padding: 5,
    paddingHorizontal: 10
  },

  errorImage: {
    display: 'none'
  },

  error: {
    paddingLeft: 0
  },
  empty: {
    paddingBottom: 60,
    paddingHorizontal: 30
  },
  countryView: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingTop: 7,
    paddingBottom: 10
  },
  countryText: {
    color: color.white,
    fontSize: 17
  },
  chevronIcon: {
    paddingLeft: 20
  },
  dividerStyle: {
    borderBottomColor: formattedColor.white.opacity(0.8)
  },
  flex: {
    flex: 1
  },
  labelDefault: {
    fontSize: 14,
    color: formattedColor.white.opacity(0.7),
    marginTop: 13
  },
  marginTop: {
    marginTop: 13
  },
  labelTitle: {
    color: color.white,
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 30,
    marginBottom: 11
  },
  btnsRow: {
    marginTop: 20,
    flexDirection: 'row'
  },
  countryList: {
    paddingBottom: 30
  },
  hide: {
    opacity: 0
  }
});

export default styles;
