import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { curry, noop } from 'lodash';
import { color, withTheme } from 'theme';
import { View, KeyboardAvoidingView, ScrollView, Text, TouchableOpacity } from 'react-native';
import { CardIOModule, CardIOUtilities } from 'react-native-awesome-card-io';

import { changePaymentField, changePaymentFields, resetPaymentFields } from 'actions/passenger';
import { postEvent } from 'actions/app/gett';
import { throttledAction, isIOS } from 'utils';

import { Input, DismissKeyboardView, Modal, Icon, Divider } from 'components';

import { containers } from 'testIDs';

import { extractedDate, getValue, helpInfo, prepareCardEditor, prepareCardEditorInputs } from './utils';
import styles from './styles';

const IDs = containers.PaymentCards;

class PaymentCardEditor extends PureComponent {
  state = {
    type: 'cvv',
    isVisible: false
  };

  static propTypes = {
    changePaymentField: PropTypes.func,
    changePaymentFields: PropTypes.func,
    error: PropTypes.object,
    label: PropTypes.string,
    navigation: PropTypes.object,
    paymentCard: PropTypes.object,
    postEvent: PropTypes.func,
    resetPaymentFields: PropTypes.func,
    theme: PropTypes.object,
    themedStyles: PropTypes.object
  };

  componentDidMount() {
    if (isIOS) {
      CardIOUtilities.preload();
    }
  }

  componentWillUnmount() {
    this.props.resetPaymentFields();
  }

  handleScanCard = () => {
    this.props.postEvent('payment_cards|add_credit_card|scan|button_clicked');
    CardIOModule
      .scanCard({
        hideCardIOLogo: true,
        useCardIOLogo: false,
        requireExpiry: true,
        requireCVV: true,
        requireCardholderName: false,
        scanExpiry: true,
        keepStatusBarStyle: true,
        suppressScannedCardImage: true,
        usePaypalActionbarIcon: false
      })
      .then(this.onScannedCard)
      .catch(noop);
  };

  onScannedCard = (card) => {
    const { expiryMonth, expiryYear, cvv, cardNumber, cardholderName } = card;
    const data = {};
    if (cardholderName) {
      data.holderName = cardholderName;
    }
    if (cardNumber) {
      data.cardNumber = cardNumber;
    }
    if (expiryMonth && expiryYear) {
      data.expirationMonth = expiryMonth;
      data.expirationYear = expiryYear;
      data.expirationDate = { month: expiryMonth, year: expiryYear };
    }
    if (cvv) {
      data.cvv = cvv;
    }

    const { postEvent, changePaymentFields } = this.props;

    postEvent('payment_cards|add_credit_card|scan_completed');
    changePaymentFields(data);
  };

  handleMaskInputChange = curry((field, formatted, extracted) => {
    this.props.changePaymentField(field, extracted);
  });

  handleInputChange = curry((field, value) => {
    this.props.changePaymentField(field, value);
  });

  handleExpirationDate = (formatted) => {
    const { month, year } = extractedDate(formatted);

    this.props.changePaymentFields({
      expirationMonth: +month,
      expirationYear: +year,
      expirationDate: { month, year }
    });
  };

  closaModal = () => {
    this.setState({ isVisible: false });
  };

  openModal = () => {
    this.setState({ isVisible: true });
  };

  changeType = (type) => {
    this.setState({ type });
  };

  onHelpPress = (type) => {
    this.changeType(type);
    this.openModal();
  };

  goToPaymentCardTypes = throttledAction(() => {
    this.props.navigation.navigate('PaymentCardTypes', { theme: this.props.theme });
  });

  renderInfo = (type) => {
    const { themedStyles, theme } = this.props;
    const info = helpInfo[type];

    return type && (
      <View style={themedStyles.infoView}>
        <Text style={themedStyles.infoLabel}>{info.label}</Text>
        <View style={themedStyles.infoUnderView}>
          <Text style={themedStyles.infoText}>{info.text}</Text>
          <Icon name={info.icon} textColor={theme.color.arrowRight} height={55} width={96} />
        </View>
      </View>
    );
  };

  renderInput = (props) => {
    const { themedStyles } = this.props;
    return (
      <Input
        key={props.label}
        labelStyle={themedStyles.inputLabel}
        inputStyle={themedStyles.input}
        style={themedStyles.inputContainer}
        errorStyle={themedStyles.error}
        allowClear
        helpIconColor={color.secondaryText}
        helpIconStyle={themedStyles.helpIcon}
        clearIconStyle={themedStyles.clearIcon}
        {...props}
      />
    );
  };

  renderItem = ({ label, text, onPress, testID }) => {
    const { themedStyles } = this.props;
    return (
      <View key={label} style={[themedStyles.commonContainer, themedStyles.paymentCardWrapper]}>
        <TouchableOpacity
          style={themedStyles.paymentView}
          activeOpacity={0.4}
          onPress={onPress}
        >
          <View style={themedStyles.flex}>
            <Text style={themedStyles.paymentCardLabel} testID={testID}>{getValue(label)}</Text>
            <Text style={themedStyles.paymentCardText} testID={testID.replace('label', 'text')}>{getValue(text)}</Text>
          </View>
          <Icon style={themedStyles.chevronIcon} name="chevron" size={16} color={color.arrowRight} />
        </TouchableOpacity>
        <Divider left={0} />
      </View>
    );
  };

  renderFields =() => {
    const { paymentCard, error } = this.props;

    return (
      <ScrollView keyboardShouldPersistTaps="always">
        {
          prepareCardEditor(paymentCard, {
            goToPaymentCardTypes: this.goToPaymentCardTypes
          }).map(this.renderItem)
        }
        {
          prepareCardEditorInputs({ ...paymentCard, error }, {
            handleMaskInputChange: this.handleMaskInputChange,
            handleInputChange: this.handleInputChange,
            handleExpirationDate: this.handleExpirationDate,
            onHelpPress: this.onHelpPress,
            scanPress: this.handleScanCard
          }).map(this.renderInput)
        }
      </ScrollView>
    );
  };

  render() {
    const { isVisible, type } = this.state;
    const { themedStyles } = this.props;
    return (
      <View style={[themedStyles.flex, themedStyles.container]} testID={IDs.editor}>
        <DismissKeyboardView style={themedStyles.flex}>
          <KeyboardAvoidingView
            keyboardVerticalOffset={80}
            behavior="padding"
            style={themedStyles.flex}
          >
            <View style={themedStyles.flex}>
              {this.renderFields()}
              <Modal
                gesturesEnabled
                isVisible={isVisible}
                onClose={this.closaModal}
                testID={`modal/${type}`}
              >
                {this.renderInfo(type)}
              </Modal>
            </View>
          </KeyboardAvoidingView>
        </DismissKeyboardView>
      </View>
    );
  }
}

const mapStateToProps = ({ passenger }) => ({
  error: passenger.validationPaymentError,
  paymentCard: passenger.newPaymentData
});

const mapDispatchToProps = {
  changePaymentField,
  changePaymentFields,
  postEvent,
  resetPaymentFields
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(PaymentCardEditor, styles));
