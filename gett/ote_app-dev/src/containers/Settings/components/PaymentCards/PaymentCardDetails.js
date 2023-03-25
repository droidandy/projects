import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

import { deactivatePayment } from 'actions/passenger';
import { Divider } from 'components';

import { strings } from 'locales';

import { withTheme } from 'theme';

import { showRemovalAlert, throttledAction } from 'utils';

import { prepareCardDetails, getValue } from './utils';
import styles from './styles';

class PaymentCardDetails extends PureComponent {
  static propTypes = {
    deactivatePayment: PropTypes.func,
    navigation: PropTypes.object,
    theme: PropTypes.object,
    themedStyles: PropTypes.object
  };

  deactivateCard = () => {
    const { deactivatePayment, navigation, theme } = this.props;
    const { paymentCard: { id }, canDelete } = navigation.state.params;

    if (!canDelete) {
      return;
    }

    showRemovalAlert({
      theme,
      message: strings('alert.message.doYouWantToDeactivateTheCard'),
      deleteLabel: strings('alert.button.deactivate'),
      handler: () => deactivatePayment(id).then(this.goBack)
    });
  };

  goBack = throttledAction(() => this.props.navigation.goBack(null));

  renderItem = ({ label, text, testID }, index, arr) => {
    const { themedStyles } = this.props;
    return (
      <View key={index} testID={testID}>
        <View style={[themedStyles.commonContainer, themedStyles.paymentWrapper]}>
          <View style={themedStyles.paymentView}>
            <View style={[themedStyles.flex, themedStyles.viewItemDetails]}>
              <Text style={themedStyles.paymentCardLabel}>{getValue(label)}</Text>
              <Text style={themedStyles.paymentCardText}>{getValue(text)}</Text>
            </View>
          </View>
        </View>
        {index + 1 < arr.length && <Divider />}
      </View>
    );
  };

  render() {
    const { navigation, themedStyles } = this.props;
    const { paymentCard, canDelete } = navigation.state.params;
    const textStyle = canDelete ? themedStyles.deactivateBtnLabel : themedStyles.deactivateBtnLabelDisabled;
    const activeOpacity = canDelete ? 0.4 : 1;

    return (
      <ScrollView style={[themedStyles.flex, themedStyles.bg]}>
        <View style={themedStyles.block}>
          {prepareCardDetails(paymentCard).map(this.renderItem)}
        </View>
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={this.deactivateCard}
          style={themedStyles.deactivateBtn}
        >
          <Text style={textStyle}>{strings('paymentCard.button.deactivate')}</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const mapDispatchToProps = {
  deactivatePayment
};

export default connect(null, mapDispatchToProps)(withTheme(PaymentCardDetails, styles));
