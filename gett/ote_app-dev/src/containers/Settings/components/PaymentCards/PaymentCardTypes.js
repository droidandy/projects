import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { capitalize } from 'lodash';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { withTheme } from 'theme';

import { changePaymentFields } from 'actions/passenger';

import { Icon, Divider } from 'components';

import { containers } from 'testIDs';

import { cardTypes } from './utils';
import styles from './styles';

const IDs = containers.PaymentCards;

class PaymentCardTypes extends Component {
  constructor(props) {
    super(props);
    this.handlers = {};
    cardTypes.forEach((type) => {
      this.handlers[type] = () => this.changePaymentCardType(type);
    });
  }

  static propTypes = {
    changePaymentFields: PropTypes.func,
    navigation: PropTypes.object,
    paymentCard: PropTypes.object,
    theme: PropTypes.object,
    themedStyles: PropTypes.object
  };

  changePaymentCardType = (type) => {
    const { changePaymentFields, navigation } = this.props;
    changePaymentFields({
      kind: type,
      personal: (type === 'personal')
    });
    navigation.goBack(null);
  };

  renderItem = (item) => {
    const { paymentCard, theme, themedStyles } = this.props;
    const isActive = paymentCard.kind === item;
    return (
      <View key={item}>
        <View style={[themedStyles.commonContainer, themedStyles.paymentWrapper]}>
          <TouchableOpacity
            style={themedStyles.paymentView}
            activeOpacity={0.4}
            onPress={this.handlers[item]}
          >
            <View style={[themedStyles.flex, themedStyles.viewItem]}>
              <Text style={themedStyles.paymentCardText} testID={item}>{capitalize(item)}</Text>
            </View>
            {isActive &&
              <Icon style={themedStyles.checkIcon} name="check" size={13} color={theme.color.primaryText} />
            }
          </TouchableOpacity>
        </View>
        <Divider />
      </View>
    );
  };

  render() {
    const { themedStyles } = this.props;
    return (
      <ScrollView style={[themedStyles.flex, themedStyles.container]}>
        <View testID={IDs.cardTypes}>
          {cardTypes.map(this.renderItem)}
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = ({ passenger }) => ({
  paymentCard: passenger.newPaymentData
});

const mapDispatchToProps = {
  changePaymentFields
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(PaymentCardTypes, styles));
