import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';

import { setInitialProfileValues, makeDefaultPhone } from 'actions/passenger';

import { Icon, CheckBox, Divider } from 'components';
import { strings } from 'locales';

import { color, withTheme } from 'theme';

import { throttledAction, formatPhoneNumber } from 'utils';
import { containers } from 'testIDs';

import styles from './PaymentCards/styles';

const IDs = containers.Settings.Phones;

class PhonesList extends Component {
  static propTypes = {
    defaultPhoneType: PropTypes.string,
    makeDefaultPhone: PropTypes.func,
    navigation: PropTypes.object,
    setInitialProfileValues: PropTypes.func,
    theme: PropTypes.object,
    themedStyles: PropTypes.object
  };

  componentDidMount() {
    this.props.setInitialProfileValues();
  }

  goToSingleInputEditor = throttledAction((key) => {
    this.props.navigation.navigate('SingleInputEditor', {
      key,
      label: strings('header.title.phone'),
      theme: this.props.theme,
      restorePhone: this.props.setInitialProfileValues
    });
  });

  makeDefaultPhone = (type, data) => {
    if (data) this.props.makeDefaultPhone('defaultPhoneType', type);
  };

  renderItem = (type, data) => {
    const { defaultPhoneType, themedStyles } = this.props;
    const isActiveStatus = defaultPhoneType === type;

    return (
      <View key={type} testID={`${IDs[type]}/${IDs.numberView}`}>
        <View style={[themedStyles.commonContainer, themedStyles.paymentWrapper]}>
          <View style={themedStyles.checkboxWrapper}>
            <CheckBox
              disabled={!data}
              status={isActiveStatus}
              onPress={this.makeDefaultPhone.bind(null, type, data)}
              testID={`${type}CheckBox`}
            />
          </View>
          <TouchableOpacity
            style={themedStyles.paymentView}
            activeOpacity={0.4}
            onPress={() => this.goToSingleInputEditor(type)}
          >
            <View style={[themedStyles.flex, themedStyles.viewItem]}>
              <Text style={themedStyles[`paymentText${data ? 'Primary' : ''}`]} testID={`${type}Number`}>
                {data ? formatPhoneNumber(data) : strings('phones.label.addAnotherPhone')}
              </Text>
            </View>
            <Icon style={themedStyles.chevronIcon} name="chevron" size={16} color={color.arrowRight} />
          </TouchableOpacity>
        </View>
        <Divider />
      </View>
    );
  };

  renderPhone = (type) => {
    const data = this.props[type];

    return data ? this.renderItem(type, data) : this.renderItem(type);
  };

  render() {
    const { themedStyles } = this.props;
    return (
      <ScrollView style={[themedStyles.flex, themedStyles.container]} testID={IDs.list}>
        {this.renderPhone('phone')}
        {this.renderPhone('mobile')}
      </ScrollView>
    );
  }
}

const mapStateToProps = ({ passenger: { data } }) => ({
  defaultPhoneType: data.passenger.defaultPhoneType,
  mobile: data.passenger.mobile,
  phone: data.passenger.phone
});

const mapDispatchToProps = {
  makeDefaultPhone,
  setInitialProfileValues
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(PhonesList, styles));
