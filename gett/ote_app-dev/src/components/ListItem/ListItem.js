import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View } from 'react-native';

import { Icon, Avatar } from 'components';
import { withTheme } from 'theme';
import styles from './styles';

function ListItem({
  themedStyles, theme, isSelected, onPress, style, title, titleNumberOfLines, titleStyle, avatarTitle, avatarUrl,
  subTitle, subTitleStyle, testID
}) {
  const containerStyles = [themedStyles.container, themedStyles.flex, style];
  const innerContainerStyles = [themedStyles.innerContainer, themedStyles.flex];
  const viewStyles = [themedStyles.flex];
  if (isSelected) viewStyles.push(themedStyles.viewSelected);
  if (avatarTitle) {
    containerStyles.push(themedStyles.itemWithAvatar);
    innerContainerStyles.push(themedStyles.itemWithAvatar);
  }

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={containerStyles}
      onPress={onPress}
      testID={testID}
    >
      {avatarTitle && <Avatar style={themedStyles.avatar} source={avatarUrl} title={avatarTitle} />}

      <View style={innerContainerStyles}>
        <View style={viewStyles}>
          {title && <Text style={[themedStyles.title, titleStyle]} numberOfLines={titleNumberOfLines}>{title}</Text>}
          {subTitle &&
            <Text style={[themedStyles.subTitle, subTitleStyle]}>
              {subTitle}
            </Text>
          }
        </View>

        {isSelected && <Icon name="check" size={13} color={theme.color.primaryText} />}
      </View>
    </TouchableOpacity>
  );
}

ListItem.propTypes = {
  avatarTitle: PropTypes.string,
  avatarUrl: PropTypes.string,
  isSelected: PropTypes.bool,
  onPress: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  subTitle: PropTypes.string,
  subTitleStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  testID: PropTypes.string,
  theme: PropTypes.object,
  themedStyles: PropTypes.object,
  title: PropTypes.string,
  titleNumberOfLines: PropTypes.number,
  titleStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

ListItem.defaultProps = {
  isSelected: false,
  onPress: () => {}
};

export default withTheme(ListItem, styles);
