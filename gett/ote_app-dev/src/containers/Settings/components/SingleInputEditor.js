import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, BackHandler } from 'react-native';
import PhoneInput from 'react-native-phone-input';

import { Input } from 'components';

import { strings } from 'locales';

import { withTheme } from 'theme';

import { showConfirmationAlert, formatPhoneNumber } from 'utils';

import { setInitialProfileValues, changeProfileFieldValue, touchField } from 'actions/passenger';
import { containers } from 'testIDs';
import styles from './EditProfileStyles';

const IDs = containers.Settings.SingleInputEditor;

class SingleInputEditor extends Component {
  static propTypes = {
    changeProfileFieldValue: PropTypes.func,
    data: PropTypes.string,
    error: PropTypes.object,
    input: PropTypes.string,
    navigation: PropTypes.object,
    setInitialProfileValues: PropTypes.func,
    theme: PropTypes.object,
    themedStyles: PropTypes.object,
    touched: PropTypes.bool,
    touchField: PropTypes.func
  };

  static defaultProps = {
    input: ''
  };

  componentDidMount() {
    this.props.setInitialProfileValues();

    this.backListener = BackHandler.addEventListener('backPress', () => {
      const { touched, theme } = this.props;

      if (touched) {
        showConfirmationAlert({ theme, title: strings('alert.title.goBack'), handler: this.goBack });
        return true;
      }

      this.goBack();
      return true;
    });
  }

  componentWillUnmount() {
    this.props.touchField('profile', false);

    this.backListener.remove();

    BackHandler.removeEventListener('backPress');
  }

  goBack = () => this.props.navigation.goBack(null);

  handleChange = (value) => {
    const { changeProfileFieldValue, navigation } = this.props;
    const { key } = navigation.state.params;

    changeProfileFieldValue(key, value.trim());

    if (key === 'mobile' && !value.length) {
      changeProfileFieldValue('defaultPhoneType', 'phone');
    }
  };

  renderInput = () => {
    const { data, error, navigation, themedStyles } = this.props;
    const { key, label } = navigation.state.params;
    const keyboardType = key === 'email' ? 'email-address' : 'default';

    return (
      <Input
        keyboardType={keyboardType}
        value={data}
        error={error && error[key]}
        label={label}
        autoFocus
        style={themedStyles.inputContainer}
        onChangeText={this.handleChange}
        inputStyle={themedStyles.input}
        clearIconStyle={themedStyles.clearIcon}
        testID={IDs.emailInput}
        clearIconTestID={IDs.emailClearIcon}
      />
    );
  };

  renderPhoneInput = () => {
    const { data, error, navigation, themedStyles } = this.props;
    const { key } = navigation.state.params;

    return (
      <PhoneInput
        value={formatPhoneNumber(data)}
        onChangePhoneNumber={this.handleChange}
        initialCountry="gb"
        style={themedStyles.phoneInputWrapper}
        allowZeroAfterCountryCode={false}
        textComponent={Input}
        textProps={{
          placeholder: strings('header.title.phone'),
          autoFocus: true,
          inputStyle: themedStyles.input,
          error: error && error[key],
          allowClear: false,
          maxLength: 15,
          testID: IDs.phoneInput
        }}
        textStyle={themedStyles.phoneInput}
        flagStyle={themedStyles.flag}
      />
    );
  }

  render() {
    const { navigation, themedStyles } = this.props;

    const phoneKeys = ['phone', 'mobile'];

    const requiredPhoneInput = phoneKeys.includes(navigation.state.params.key);

    return (
      <View style={[themedStyles.flex, themedStyles.singleInputContainer]} testID={IDs.container}>
        {requiredPhoneInput ? this.renderPhoneInput() : this.renderInput()}
      </View>
    );
  }
}

const mapStateToProps = ({ passenger }, props) => ({
  data: passenger.temp[props.navigation.state.params.key] || '',
  error: passenger.temp.validationError,
  touched: passenger.temp.profileTouched
});

const mapDispatchToProps = {
  changeProfileFieldValue,
  setInitialProfileValues,
  touchField
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(SingleInputEditor, styles));
