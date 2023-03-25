import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Text, View } from 'react-native';

import { Icon } from 'components';

import { strings } from 'locales';

import { color, withTheme } from 'theme';

import styles from './styles';

const JourneyDetails = ({ style, time, distance, loading, timeLabel, theme, themedStyles }) => {
  const iconColor = theme.isNightMode ? color.white : color.black;
  const renderBlockItem = (item) => {
    const { label, text, icon } = item;
    return (
      <View style={themedStyles.blockItem}>
        {icon}
        <View style={themedStyles.textLines}>
          <Text numberOfLines={1} style={themedStyles.label}>{label}</Text>
          {
            !loading
              ? <Text numberOfLines={1} style={themedStyles.labelBold}>{text}</Text>
              : <ActivityIndicator style={themedStyles.loading} size="small" color={color.pixelLine} />
          }
        </View>
      </View>
    );
  };

  return (
    <View style={[themedStyles.container, style]}>
      {
        renderBlockItem({
          label: strings(`order.label.${timeLabel || 'journeyTime'}`),
          text: time,
          icon: <Icon style={themedStyles.icon} name="timer" width={20} height={24} color={iconColor}/>
        })
      }
      <View style={themedStyles.divider} />
      {
        renderBlockItem({
          label: strings('order.label.distance'),
          text: distance,
          icon: <Icon style={themedStyles.icon} name="distance" width={24} height={14} color={iconColor}/>
        })
      }
    </View>
  );
};

JourneyDetails.propTypes = {
  distance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  loading: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  theme: PropTypes.object,
  themedStyles: PropTypes.object,
  time: PropTypes.string,
  timeLabel: PropTypes.string
};

JourneyDetails.defaultProps = {
  distance: '',
  style: {},
  time: ''
};

export default withTheme(JourneyDetails, styles);
