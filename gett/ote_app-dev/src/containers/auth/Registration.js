import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  TouchableOpacity,
  StatusBar,
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  BackHandler
} from 'react-native';
import { Answers } from 'react-native-fabric';

import { company, GA } from 'api';

import {
  Icon,
  Input,
  DismissKeyboardView,
  Divider,
  SuccessPopup,
  Background,
  Header,
  BackBtn,
  Button
} from 'components';
import update from 'update-js/fp';
import { curry, isEqual } from 'lodash';

import { postEvent } from 'actions/app/gett';

import { strings } from 'locales';

import { color, withTheme } from 'theme';

import {
  throttledAction,
  isInputsValid,
  prepareCompanyRegistrationProperties,
  showConfirmationAlert,
  showInfoAlert
} from 'utils';

import { CheckItem } from './components';

import CountrySelector from './CountrySelector';

import { prepareCheckBlocks, prepareInputsBlock } from './utils';
import { registerCompanyRules } from './validatorRules';
import styles from './style';

const defaultCountry = {
  value: 'GB',
  label: 'United Kingdom'
};

const initialForm = {
  userName: '',
  phoneNumber: '',
  email: '',
  name: '',
  comment: '',
  country: defaultCountry.value,
  acceptTac: false,
  acceptPp: false
};

class Registration extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object,
    theme: PropTypes.object
  };

  constructor(props) {
    super(props);
    const fields = ['userName', 'phoneNumber', 'email', 'name', 'comment', 'acceptTac', 'acceptPp'];
    this.handlers = {};
    fields.forEach((field) => {
      this.handlers[field] = this.handleInputChange(field);
    });
  }

  state = {
    loading: false,
    errors: null,
    currentCountry: defaultCountry,
    form: initialForm,
    isVisibleCountrySelector: false,
    touched: false
  };

  setSuccessPopupRef = (el) => { this.successPopup = el; };

  componentDidMount() {
    GA.postEvent('new_account|screen_appears');
    this.backListener = BackHandler.addEventListener('backPress', this.handleBackPress);
  }

  componentWillUnmount() {
    this.backListener.remove();
    BackHandler.removeEventListener('backPress');
  }

  handleBackPress = () => {
    const { touched } = this.state;
    const { theme } = this.props;

    if (touched && !isEqual(this.state.form, initialForm)) {
      showConfirmationAlert({
        theme,
        title: strings('alert.message.areYouSure'),
        message: strings('alert.message.dataWillNotBeSaved'),
        handler: this.goBack
      });
      return true;
    }

    this.goBack();
    return true;
  };

  goBack = () => this.props.navigation.goBack(null);

  handleInputChange = curry((input, value) => {
    this.setState(update({ [`form.${input}`]: value, touched: true }));
  });

  handleChangeCountry = (v) => {
    this.setState(update({ 'form.country': v.value || '', currentCountry: v }));
  };

  setErrors = (errors) => {
    this.setState({ errors });
  };

  handleSubmit = () => {
    const keys = ['userName', 'phoneNumber', 'email', 'name'];
    const { form } = this.state;

    if (isInputsValid(keys, form, registerCompanyRules, this.setErrors)) {
      GA.postEvent('new_account|sent|button_clicked', prepareCompanyRegistrationProperties(form));
      this.setState({ loading: true, errors: null });
      company.createCompanySignupRequest(form)
        .then(this.handleRegisterSuccess)
        .catch(this.handleRegisterError);
    }
  };

  handleRegisterSuccess = () => {
    Answers.logSignUp('Company', true);
    this.setState({ loading: false, form: initialForm });
    this.successPopup.open();
  };

  handleRegisterError = () => {
    const error = strings('alert.message.youCanNotRegisterCompany');
    Answers.logSignUp('Company', false, { error });
    this.setState({ loading: false });
    showInfoAlert({ message: error });
  };

  handleConfirm = () => {
    this.successPopup.close();
    this.goBack();
  };

  handleOpenCountrySelector = () => {
    this.setState({ isVisibleCountrySelector: true });
  };

  handleCloseCountrySelector = () => {
    this.setState({ isVisibleCountrySelector: false });
  };

  goToInfoPage = throttledAction((page) => {
    Answers.logContentView(`${strings(`information.${page}`)} was opened`, 'screen view', `${page}Open`);
    this.props.navigation.navigate('InfoPages', { page, theme: this.props.theme });
  });

  goToTermsConditions = () => this.goToInfoPage('termsConditions');

  goToPrivacyPolicy = () => this.goToInfoPage('privacyPolicy');

  renderInputItem = (props, index) => (
    <Input
      key={index}
      style={styles.input}
      inputStyle={styles.inputStyle}
      containerStyle={styles.inputContainer}
      labelStyle={styles.label}
      clearIconColor={color.white}
      {...props}
    />
  );

  renderCheckItem = (props, index) => <CheckItem key={index} {...props} />;

  renderListItem = ({ label, onPress, title }) => (
    <View style={styles.flex}>
      {label && <Text style={styles.labelDefault}>{label}</Text>}
      <TouchableOpacity
        style={styles.countryView}
        activeOpacity={0.6}
        onPress={onPress}
      >
        <View style={styles.flex}>
          {title && <Text style={styles.countryText}>{title}</Text>}
        </View>
        <Icon style={styles.chevronIcon} name="chevron" size={16} color={color.white} />
      </TouchableOpacity>
      <Divider left={0} style={styles.dividerStyle}/>
    </View>
  );

  renderContainer = () => {
    const { navigation } = this.props;
    const { form, errors, loading, currentCountry, isVisibleCountrySelector } = this.state;
    const checkBlocks = prepareCheckBlocks(form, {
      handleAcceptTacChange: this.handlers.acceptTac,
      handleAcceptPpChange: this.handlers.acceptPp,
      goToTermsConditions: this.goToTermsConditions,
      goToPrivacyPolicy: this.goToPrivacyPolicy
    });

    const inputs = prepareInputsBlock({ ...form, errors }, {
      handleUserNameChange: this.handlers.userName,
      handlePhoneNumberChange: this.handlers.phoneNumber,
      handleEmailChange: this.handlers.email,
      handleNameChange: this.handlers.name,
      handleCommentChange: this.handlers.comment
    });

    const placeholderWidth = Platform.OS === 'ios' ? 75 : 37;

    return (
      <Background>
        <KeyboardAvoidingView
          keyboardVerticalOffset={0}
          behavior="padding"
          style={styles.flex}
        >
          <Header
            navigation={navigation}
            titleCenter
            title={strings('header.title.yourEnquiry')}
            leftButton={<BackBtn color={color.white} navigation={navigation} handlePress={this.handleBackPress}/>}
            rightButton={<View style={{ width: placeholderWidth }} />} // placeholder for title aligning
          />
          <ScrollView>
            <TouchableOpacity>
              <TouchableWithoutFeedback>
                <View style={styles.flex}>
                  <View style={styles.empty}>
                    <Text style={styles.labelTitle}>{strings('auth.text.oneTransportForYourBusiness')}</Text>
                    {inputs.map(this.renderInputItem)}
                    {this.renderListItem({
                      label: strings('auth.label.selectPrimaryCountry'),
                      onPress: this.handleOpenCountrySelector,
                      title: currentCountry.label
                    })}
                    {checkBlocks.map(this.renderCheckItem)}
                    <Button
                      disabled={!form.acceptTac || !form.acceptPp}
                      loading={loading}
                      onPress={this.handleSubmit}
                      stretched
                      style={styles.btn}
                      title={strings('auth.button.send')}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </TouchableOpacity>
          </ScrollView>

          <CountrySelector
            onSelect={this.handleChangeCountry}
            selected={currentCountry}
            isVisible={isVisibleCountrySelector}
            onClose={this.handleCloseCountrySelector}
          />
        </KeyboardAvoidingView>
      </Background>
    );
  };

  successPopupBtns = [{ title: strings('alert.button.ok'), onPress: this.handleConfirm }];

  render() {
    return (
      <DismissKeyboardView style={styles.screen}>
        <StatusBar barStyle="light-content" />
        {this.renderContainer()}
        <SuccessPopup
          popupRef={this.setSuccessPopupRef}
          title={strings('popup.companyRequest.title')}
          content={strings('popup.companyRequest.description')}
          buttons={this.successPopupBtns}
        />
      </DismissKeyboardView>
    );
  }
}

const mapDispatchToProps = {
  postEvent
};

export default connect(null, mapDispatchToProps)(withTheme(Registration));
