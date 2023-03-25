import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { noop } from 'lodash';
import { View, Text, TouchableOpacity } from 'react-native';
import { color, withTheme } from 'theme';
import Swipeout from 'react-native-swipeout';

import { makeDefaultPayment, deactivatePayment, changeSwipedPaymentCard } from 'actions/passenger';

import { Icon, CheckBox, Divider, ListView } from 'components';

import { throttledAction, showRemovalAlert } from 'utils';
import { strings } from 'locales';
import { containers } from 'testIDs';
import { getValue } from './utils';

import Tip from '../Tip';

import styles from './styles';

const IDs = containers.PaymentCards;

class PaymentCardsList extends Component {
  static propTypes = {
    changeSwipedPaymentCard: PropTypes.func,
    deactivatePayment: PropTypes.func,
    makeDefaultPayment: PropTypes.func,
    navigation: PropTypes.object,
    paymentCards: PropTypes.array,
    swipedCardId: PropTypes.number,
    theme: PropTypes.object,
    themedStyles: PropTypes.object
  };

  goToPaymentDetails = throttledAction((item) => {
    this.changeSwipedItem();
    this.props.navigation.navigate('PaymentCardDetails', {
      paymentCard: item,
      canDelete: this.isCardDeactivationEnabled(),
      theme: this.props.theme
    });
  });

  isCardDeactivationEnabled = () => (this.props.paymentCards.length > 1);

  makeDefaultPayment = (id) => {
    this.props.makeDefaultPayment(id);
  };

  changeSwipedItem = (id) => {
    this.props.changeSwipedPaymentCard(id);
  };

  keyExtractor = item => String(item.id);

  deactivateCard = (id) => {
    showRemovalAlert({
      theme: this.props.theme,
      message: strings('alert.message.doYouWantToDeactivateTheCard'),
      deleteLabel: strings('alert.button.deactivate'),
      handler: () => this.props.deactivatePayment(id)
    });
  };

  renderDeactivateButton = (item) => {
    const { themedStyles } = this.props;
    return (
      [
        {
          component: (
            <View style={themedStyles.buttonView} testID={IDs.deactivate}>
              <Text style={themedStyles.buttonText}>
                {strings('paymentCard.button.deactivate')}
              </Text>
            </View>
          ),
          type: 'delete',
          onPress: () => this.deactivateCard(item.id)
        }
      ]
    );
  };

  renderItem = ({ item, index }) => {
    const { themedStyles, theme, swipedCardId } = this.props;
    return (
      <Swipeout
        key={item.id}
        autoClose
        sensitivity={25}
        close={swipedCardId !== item.id}
        backgroundColor={theme.color.bgPrimary}
        buttonWidth={100}
        onOpen={() => this.changeSwipedItem(item.id)}
        onClose={noop}
        scroll={noop}
        right={this.isCardDeactivationEnabled() ? this.renderDeactivateButton(item) : null}
      >
        <View key={item.id} testID={`${IDs.card}[${index}]`}>
          <View style={[themedStyles.commonContainer, themedStyles.paymentWrapper]}>
            <View style={themedStyles.checkboxWrapper}>
              <CheckBox
                status={item.default}
                onPress={() => this.makeDefaultPayment(item.id)}
                testID={`checkbox[${index}]`}
              />
            </View>
            <TouchableOpacity
              style={themedStyles.paymentView}
              activeOpacity={0.4}
              onPress={() => this.goToPaymentDetails(item)}
            >
              <View style={[themedStyles.flex, themedStyles.viewItem]}>
                <Text style={themedStyles.paymentText}>{getValue(item.kind)}</Text>
                <Text style={themedStyles.paymentText}>****</Text>
                <Text style={themedStyles.paymentText}>{getValue(item.last4)}</Text>
              </View>
              <Icon style={themedStyles.chevronIcon} name="chevron" size={16} color={color.arrowRight} />
            </TouchableOpacity>
          </View>
          <Divider />
        </View>
      </Swipeout>
    );
  };

  render() {
    const { paymentCards, themedStyles, swipedCardId } = this.props;
    return (
      <ListView
        style={themedStyles.listItem}
        listViewStyle={themedStyles.container}
        emptyLabel="cards"
        typeSections={false}
        items={paymentCards}
        extraData={swipedCardId}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        footerComponent={this.isCardDeactivationEnabled() && <Tip label={strings('tip.text.removeCard')} />}
        testID={IDs.list}
      />
    );
  }
}

const mapStateToProps = ({ passenger: { data, temp } }) => ({
  paymentCards: data.paymentCards,
  swipedCardId: temp.swipedCardId
});

const mapDispatchToProps = {
  changeSwipedPaymentCard,
  deactivatePayment,
  makeDefaultPayment
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(PaymentCardsList, styles));
