import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { withTheme } from 'theme';

import { Icon } from 'components';
import { FastComponent } from 'utils';

import Marker from './Basic';

import styles from './styles';

class InfoMarker extends FastComponent {
  static propTypes = {
    coordinate: PropTypes.object.isRequired,
    icon: PropTypes.string,
    theme: PropTypes.object,
    themedStyles: PropTypes.object,
    title: PropTypes.string,
    value: PropTypes.string
  };

  render() {
    const { coordinate, icon, title, value, theme, themedStyles } = this.props;

    return (
      <Marker
        coordinate={coordinate}
        id={`infoMarker${title}${value}${theme.type}`}
        anchorY={1.2}
      >
        <View style={themedStyles.infoMarkerContainer}>
          <View style={themedStyles.infoMarker}>
            <Icon style={themedStyles.infoMarkerIcon} name={icon} size={18} color={theme.color.primaryText}/>
            <View>
              <Text numberOfLines={1} style={themedStyles.infoMarkerTitle}>
                {title}
              </Text>
              <Text numberOfLines={1} style={themedStyles.infoMarkerValue}>
                {value}
              </Text>
            </View>
          </View>
        </View>
      </Marker>
    );
  }
}

export default withTheme(InfoMarker, styles);
