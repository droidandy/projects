import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import moment from 'moment-timezone';

import { Icon } from 'components';

import { strings } from 'locales';
import { withTheme } from 'theme';

import { timeFormat } from 'utils';

import styles from './styles';

const PickUpLabel = (props) => {
  const {
    booking: { scheduledType, scheduledAt, recurringNext },
    theme,
    wrapperStyle,
    themedStyles,
    editingDisable
  } = props;

  return (
    <View style={[themedStyles.pickupTimeContainer, wrapperStyle]}>
      <Icon name="clock" size={24} color={theme.color.primaryText} />
      <View style={themedStyles.pickupTime}>
        <Text style={themedStyles.pickupTimeLabel}>{strings('order.label.pickupTime')}</Text>
        <Text style={themedStyles.pickupTimeValue}>
          {scheduledType !== 'now'
            ? moment(scheduledAt).format(`D MMM YYYY, ${timeFormat()}`)
            : strings('order.label.onDemand')
          }
        </Text>
      </View>
      {(scheduledType === 'recurring' || recurringNext) &&
        <View style={themedStyles.recurringIcon}>
          <Icon name="recurring" color={theme.color.primaryText} size={16} />
        </View>
      }
      {!editingDisable &&
        <View style={themedStyles.chevronIcon}>
          <Icon name="chevron" size={16} color={theme.color.arrowRight} />
        </View>
      }
    </View>
  );
};

PickUpLabel.propTypes = {
  booking: PropTypes.object,
  editingDisable: PropTypes.bool,
  theme: PropTypes.object,
  themedStyles: PropTypes.object,
  wrapperStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

export default withTheme(PickUpLabel, styles);
