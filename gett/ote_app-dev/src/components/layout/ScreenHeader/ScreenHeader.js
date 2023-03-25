import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StatusBar, TouchableOpacity } from 'react-native';

import { Icon } from 'components';

import { withTheme } from 'theme';

import { touchableArea } from 'utils';

import styles from './styles';

const backIconSize = 20;
const backBtnOpacity = 0.6;

function ScreenHeader(props) {
  const { themedStyles, theme } = props;
  const goBack = () => {
    if (props.handleBackBtnPress) {
      return props.handleBackBtnPress();
    }
    return props.navigation.goBack();
  };

  const renderBackBtn = () => (
    <TouchableOpacity
      activeOpacity={backBtnOpacity}
      onPress={props.onBackPress || goBack}
      style={themedStyles.backBtn}
      hitSlop={touchableArea}
      testID={props.backTestID}
    >
      <Icon style={themedStyles.backIcon} name="back" size={backIconSize} color={theme.color.primaryText} />
      <Text style={themedStyles.text}>Back</Text>
    </TouchableOpacity>
  );

  return (
    <View style={props.headerContainerStyle}>
      <StatusBar translucent animated barStyle={theme.isNightMode ? 'light-content' : 'default'} />
      <View style={[themedStyles.header, props.headerStyle]}>
        {props.leftContent ? props.leftContent : renderBackBtn()}
        <Text numberOfLines={1} style={[themedStyles.flex, themedStyles.text, themedStyles.title]}>{props.title}</Text>
        {props.rightContent
          ? <View style={[themedStyles.rightContent, props.rightContentStyle]}>{props.rightContent}</View>
          : <View style={themedStyles.placeholder} />
        }
      </View>
    </View>
  );
}

ScreenHeader.propTypes = {
  backTestID: PropTypes.string,
  handleBackBtnPress: PropTypes.func,
  headerContainerStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  headerStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  leftContent: PropTypes.node,
  navigation: PropTypes.object,
  onBackPress: PropTypes.func,
  rightContent: PropTypes.node,
  rightContentStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  theme: PropTypes.object,
  themedStyles: PropTypes.object,
  title: PropTypes.string
};

export default withTheme(ScreenHeader, styles);
