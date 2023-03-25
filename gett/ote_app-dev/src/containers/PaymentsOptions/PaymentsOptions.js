import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity } from 'react-native';
import { flatMap, capitalize, last, split } from 'lodash';

import { Icon, CheckBox, Divider, ListView } from 'components';
import { color, withTheme } from 'theme';

import { changeFields } from 'actions/booking';

import {
  paymentTypeLabels,
  paymentTypeToAttrs
} from 'containers/shared/bookings/data';

import { containers } from 'testIDs';

import styles from './styles';

const IDs = containers.PaymentCards;
const LIST_ITEM_HEIGHT = 53;

class PaymentsOptions extends Component {
  static propTypes = {
    booking: PropTypes.object,
    changeFields: PropTypes.func,
    companyPaymentTypes: PropTypes.array,
    onClose: PropTypes.func,
    paymentCards: PropTypes.array,
    themedStyles: PropTypes.object
  };

  preparePaymentTypes = () => {
    const { companyPaymentTypes, paymentCards } = this.props;

    return flatMap(companyPaymentTypes, (type) => {
      if (type !== 'passenger_payment_card' && type !== 'passenger_payment_card_periodic') {
        return { value: type, label: paymentTypeLabels[type], icon: type };
      } if (paymentCards) {
        return paymentCards.map(card => ({
          value: `${card.type}_payment_card:${card.id}`,
          label: `${capitalize(card.type)} card ${last(split(card.title, ' '))}`,
          icon: 'paymentMethod',
          id: card.id
        }));
      }
      return null;
    }).filter(Boolean);
  };

  onChangePaymentType = (item) => {
    const { onClose, changeFields } = this.props;
    onClose();
    setTimeout(() => {
      changeFields(paymentTypeToAttrs(item.value), true);
    }, 350); // for smooth animation
  };

  renderItem = ({ item, index }) => {
    const { booking: { paymentMethod, paymentCardId }, themedStyles } = this.props;
    const isSelected = item.value === paymentMethod || item.value === `${paymentMethod}:${paymentCardId}`;

    return (
      <Fragment key={index}>
        {index > 0 && <Divider />}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => this.onChangePaymentType(item)}
          testID={`${IDs.card}[${index}]`}
        >
          <View style={[themedStyles.commonContainer, themedStyles.paymentWrapper]} >
            <View style={themedStyles.checkboxWrapper}>
              <CheckBox status={isSelected} />
            </View>
            <View style={themedStyles.paymentView}>
              {item.icon && <Icon style={themedStyles.icon} name={item.icon} color={color.arrowRight} />}
              <View style={[themedStyles.flex, themedStyles.viewItem]}>
                {item.label && <Text style={themedStyles.paymentText}>{item.label}</Text>}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Fragment>
    );
  };

  render() {
    const { themedStyles } = this.props;
    const paymentTypes = this.preparePaymentTypes();

    return (
      <View style={[themedStyles.container, { height: LIST_ITEM_HEIGHT * paymentTypes.length }]}>
        <ListView
          style={[themedStyles.flex, themedStyles.listView]}
          displayType="list"
          typeSections={false}
          items={paymentTypes}
          changeableList={false}
          renderItem={this.renderItem}
          testID={IDs.list}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ booking, session }) => {
  const { passenger, passengers, paymentTypes } = booking.formData;
  const { passengerId } = booking.bookingForm;
  const currentId = passengerId || session.user.memberId;

  return {
    companyPaymentTypes: paymentTypes,
    paymentCards: (passenger || passengers.find(passenger => passenger.id === currentId)).paymentCards
  };
};

const mapDispatchToProps = ({
  changeFields
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(PaymentsOptions, styles));
