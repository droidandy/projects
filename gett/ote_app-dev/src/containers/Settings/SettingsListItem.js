import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Text } from 'react-native';
import { withTheme } from 'theme';

import { Icon, Badge, Avatar, Divider, Switch } from 'components';

import styles from './style';

class SettingsListItem extends PureComponent {
  static propTypes = {
    avatar: PropTypes.string,
    badgeValue: PropTypes.number,
    hideChevron: PropTypes.bool,
    icon: PropTypes.string,
    last: PropTypes.bool,
    onPress: PropTypes.func,
    onSwitch: PropTypes.func,
    rightTitle: PropTypes.string,
    switched: PropTypes.bool,
    testID: PropTypes.string,
    theme: PropTypes.object,
    themedStyles: PropTypes.object,
    title: PropTypes.string.isRequired,
    titleAvatar: PropTypes.string
  };

  static defaultProps = {
    avatar: '',
    badgeValue: 0,
    hideChevron: false,
    rightTitle: '',
    switched: false,
    titleAvatar: ''
  };

  render() {
    const {
      title,
      rightTitle,
      icon,
      avatar,
      titleAvatar,
      hideChevron,
      switched,
      onPress,
      onSwitch,
      badgeValue,
      testID,
      themedStyles,
      theme: { color },
      last
    } = this.props;

    const Wrapper = onPress ? TouchableOpacity : View;

    return (
      <Wrapper style={themedStyles.listItem} activeOpacity={0.4} onPress={onPress}>
        {icon && <Icon style={themedStyles.icon} name={icon} size={24} color={color.primaryText} />}
        {!!titleAvatar &&
          <Avatar
            size={50}
            source={avatar}
            title={titleAvatar}
            style={themedStyles.avatar}
          />
        }
        <View style={themedStyles.listItemHolder} testID={testID}>
          <View style={themedStyles.listItemWrapper}>
            <View style={themedStyles.listItemContent}>
              <Text style={themedStyles.title} testID={`${testID}/title`}>{title}</Text>
              <Text testID={`${testID}/value`} numberOfLines={1} style={themedStyles.rightTitle}>{rightTitle}</Text>
            </View>
            {badgeValue > 0 && <Badge value={badgeValue} />}
            {!hideChevron && !onSwitch &&
              <Icon name="chevron" style={themedStyles.chevron} color={color.arrowRight} width={10} />
            }
            {hideChevron &&
              <View style={themedStyles.emptyChevron} />
            }
            {!!onSwitch &&
              <Switch value={switched} onValueChange={onSwitch} />
            }
          </View>
          {!last && <Divider style={themedStyles.divider} left={0} />}
        </View>
      </Wrapper>
    );
  }
}

export default withTheme(SettingsListItem, styles);
