import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';

import { sendCancelOrderReason } from 'actions/booking';

import { Icon } from 'components';
import { strings } from 'locales';

import { color, withTheme } from 'theme';

import { deviceHeight, deviceWidth } from 'utils';

import { cancelReasonStyles } from './styles';

const reasonIconMapping = {
  mistaken_order: 'reasonSadMan',
  driver_asked_to: 'reasonDriver',
  hailed_another_car: 'reasonTaxi',
  too_long_eta: 'timer'
};

class CancelReasonModal extends React.Component {
  static propTypes = {
    isVisible: PropTypes.bool,
    onClose: PropTypes.func,
    reasons: PropTypes.array,
    sendCancelOrderReason: PropTypes.func,
    theme: PropTypes.object,
    themedStyles: PropTypes.object
  };

  static defaultProps = {
    isVisible: false,
    onClose: () => {},
    reasons: []
  };

  submit = (reason) => {
    this.props.sendCancelOrderReason(reason)
      .then(this.props.onClose);
  };

  renderReason = (reason) => {
    const { theme, themedStyles } = this.props;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        key={reason}
        style={themedStyles.reason}
        onPress={() => this.submit(reason)}
      >
        <Icon name={reasonIconMapping[reason]} color={theme.color.primaryText} size={26} />
        <Text style={themedStyles.reasonTitle}>
          {strings(`order.cancellationReason.${reason}`)}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    const { isVisible, onClose, reasons, themedStyles } = this.props;

    return (
      <Modal
        isVisible={isVisible}
        style={themedStyles.modal}
        deviceWidth={deviceWidth}
        deviceHeight={deviceHeight}
      >
        <StatusBar barStyle="light-content" />
        <View style={themedStyles.container}>
          <TouchableOpacity activeOpacity={0.8} onPress={onClose}>
            <Icon style={themedStyles.closeIcon} size={20} name="close" color={color.white} />
          </TouchableOpacity>
          <View style={themedStyles.content}>
            <Text style={themedStyles.header}>{strings('order.text.yourRideWasCancelled')}</Text>
            <Text style={themedStyles.subHeader}>{strings('order.text.seeYouNextTime')}</Text>

            <Text style={themedStyles.title}>{strings('order.text.whyDidYouCancel')}</Text>
            <ScrollView style={themedStyles.list}>
              {reasons.map(this.renderReason)}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }
}

export default connect(null, { sendCancelOrderReason })(withTheme(CancelReasonModal, cancelReasonStyles));
