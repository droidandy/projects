import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { curry } from 'lodash';
import { View, TouchableWithoutFeedback, TouchableOpacity, Text, KeyboardAvoidingView, ScrollView } from 'react-native';

import { changeTempAddressField, changeTempAddress } from 'actions/passenger';
import { Input, AddressModal } from 'components';
import { strings } from 'locales';

import { withTheme } from 'theme';

import { containers } from 'testIDs';

import styles from './AddressStyles';

const IDs = containers.Settings.AddressEditor;

class AddressEditor extends Component {
  static propTypes = {
    address: PropTypes.object,
    changeTempAddress: PropTypes.func,
    changeTempAddressField: PropTypes.func,
    errors: PropTypes.object,
    last: PropTypes.bool,
    navigation: PropTypes.object,
    onPress: PropTypes.func,
    theme: PropTypes.object,
    themedStyles: PropTypes.object,
    touched: PropTypes.bool
  };

  setAddressModalRef = (el) => { this.addressModal = el; };

  handleInputChange = curry((field, value) => {
    this.props.changeTempAddressField(field, value);
  });

  handleAddressChange = (address) => {
    this.props.changeTempAddress(address);
  };

  toggleAddressModal = () => {
    this.addressModal.open(this.props.address.address);
  };

  renderTextInput = (props) => {
    const { themedStyles } = this.props;
    return (
      <Input
        multiline // TODO: follow known issue with scroll https://github.com/facebook/react-native/issues/16826
        borderLess={props.last}
        inputStyle={themedStyles.input}
        style={[themedStyles.inputContainer, props.last ? themedStyles.lastItem : {}]}
        clearIconStyle={themedStyles.clearIcon}
        {...props}
      />
    );
  };

  renderInput = props => (
    props.onPress
      ? <TouchableOpacity onPress={props.onPress}>
        {this.renderTextInput(props)}
      </TouchableOpacity>
      : this.renderTextInput(props)
  );

  renderForm = () => {
    const { address, errors, navigation, themedStyles } = this.props;
    const { editing } = navigation.state.params;

    return (
      <ScrollView testID={IDs.form} contentContainerStyle={themedStyles.formWrapper}>
        {
          this.renderInput({
            label: `Address Name (${this.getFieldLength(address.name)}/32)`,
            value: address.name || '',
            onChangeText: this.handleInputChange('name'),
            error: errors.name,
            maxLength: 32,
            testID: IDs.name
          })
        }
        {
          this.renderInput({
            label: 'Address',
            editable: false,
            value: (address.address?.line) || '',
            onPress: this.toggleAddressModal,
            error: errors['address.line'] || errors['address.lat'] || errors['address.countryCode'],
            allowClear: false,
            testID: IDs.address
          })
        }
        {
          this.renderInput({
            label: `Pick Up Message (${this.getFieldLength(address.pickupMessage)}/100)`,
            value: address.pickupMessage || '',
            onChangeText: this.handleInputChange('pickupMessage'),
            error: errors.pickupMessage,
            maxLength: 100,
            testID: IDs.pickupMsg
          })
        }
        {
          this.renderInput({
            label: `Destination Message (${this.getFieldLength(address.destinationMessage)}/100)`,
            value: address.destinationMessage || '',
            last: editing,
            onChangeText: this.handleInputChange('destinationMessage'),
            error: errors.destinationMessage,
            maxLength: 100,
            testID: IDs.destinationMsg
          })
        }
      </ScrollView>
    );
  };

  renderDeleteButton = () => {
    const { address, navigation, themedStyles } = this.props;
    const { onRemove, editing } = navigation.state.params;

    if (!editing) return null;

    return (
      <TouchableWithoutFeedback onPress={() => onRemove(address.id, null, navigation.goBack)}>
        <View style={themedStyles.deleteButton}>
          <Text style={themedStyles.deleteLabel}>{strings('addresses.button.delete')}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  getFieldLength = field => (field && field.length) || 0;

  renderPage = () => {
    const { themedStyles } = this.props;
    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={80}
        behavior="padding"
        style={themedStyles.flex}
      >
        {this.renderForm()}

        {this.renderDeleteButton()}
      </KeyboardAvoidingView>
    );
  };

  render() {
    const { editing } = this.props.navigation.state.params;
    const { themedStyles } = this.props;
    return (
      <View style={[
        themedStyles.flex,
        themedStyles[`container${editing ? 'Grey' : ''}`],
        { backgroundColor: this.props.theme.color[editing ? 'bgSecondary' : 'bgPrimary'] }
      ]}>
        {this.renderPage()}

        <AddressModal
          hideFavorites
          innerRef={this.setAddressModalRef}
          onChange={this.handleAddressChange}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ passenger }) => ({
  address: passenger.temp.address || {},
  errors: passenger.temp.addressErrors || {},
  touched: passenger.temp.addressTouched
});

const mapDispatchToProps = {
  changeTempAddress,
  changeTempAddressField
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(AddressEditor, styles));
