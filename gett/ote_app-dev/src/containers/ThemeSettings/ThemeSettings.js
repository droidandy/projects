import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Icon, CheckBox, Divider } from 'components';

import { changeTheme } from 'actions/app/theme';
import { postEvent } from 'actions/app/gett';

import { strings } from 'locales';

import { withTheme } from 'theme';

import { isNightModeTime } from 'utils';

import styles from './style';

class ThemeSettings extends PureComponent {
  static propTypes = {
    autoThemeMode: PropTypes.bool,
    changeTheme: PropTypes.func,
    handleOnThemeModalInfo: PropTypes.func,
    isNightMode: PropTypes.bool,
    onClose: PropTypes.func,
    postEvent: PropTypes.func,
    theme: PropTypes.object,
    themedStyles: PropTypes.object
  };

  handleOpenInfo = value => this.props.handleOnThemeModalInfo(value);

  handleOnChange = (value) => {
    const { onClose, changeTheme, postEvent } = this.props;
    onClose();
    postEvent('app_menu|color_theme|theme_selected', { theme: value });
    setTimeout(() => {
      if (value === 'auto') {
        changeTheme({ autoThemeMode: true, isNightMode: isNightModeTime() });
      } else if (value === 'day') {
        changeTheme({ autoThemeMode: false, isNightMode: false });
      } else if (value === 'night') {
        changeTheme({ autoThemeMode: false, isNightMode: true });
      }
    }, 350); // for smooth animation
  };

  renderItem = (item, index, arr) => {
    const { autoThemeMode, isNightMode, theme: { color }, themedStyles } = this.props;
    let isSelected;
    switch (item) {
      case 'auto':
        isSelected = autoThemeMode;
        break;
      case 'day':
        isSelected = !autoThemeMode && !isNightMode;
        break;
      case 'night':
        isSelected = !autoThemeMode && isNightMode;
        break;
      default:
        isSelected = false;
    }

    return (
      <Fragment key={item}>
        <TouchableOpacity activeOpacity={0.6} onPress={() => this.handleOnChange(item)}>
          <View style={themedStyles.commonContainer}>
            <View style={themedStyles.checkboxWrapper}>
              <CheckBox status={isSelected} />
            </View>
            <View style={themedStyles.lineView}>
              <Text style={themedStyles.label}>
                {strings(`settings.label.${item}`)}
              </Text>
              <TouchableWithoutFeedback onPress={() => this.handleOpenInfo(item)}>
                <View style={themedStyles.button}>
                  <Icon name="vehicleInfo" color={color.secondaryText} />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </TouchableOpacity>
        {index + 1 < arr.length && <Divider style={themedStyles.dividerStyle} />}
      </Fragment>
    );
  };

  render() {
    return (
      <View style={this.props.themedStyles.wrapper}>
        {['auto', 'day', 'night'].map(this.renderItem)}
      </View>
    );
  }
}

const mapStateToProps = ({ app }) => ({
  autoThemeMode: app.theme.autoThemeMode,
  isNightMode: app.theme.isNightMode
});

const mapDispatchToProps = ({
  changeTheme,
  postEvent
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ThemeSettings, styles));
