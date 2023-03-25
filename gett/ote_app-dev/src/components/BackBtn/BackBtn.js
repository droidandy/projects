import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { StyleSheet, Text, TouchableOpacity, Keyboard } from 'react-native';

import { Icon } from 'components';

import { strings } from 'locales';

import { withTheme } from 'theme';

import { throttledAction, showConfirmationAlert, isIOS, touchableArea } from 'utils';
import { components } from 'testIDs';

const IDs = components.BackButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8
  },
  text: {
    fontSize: 17
  }
});

class BackBtn extends Component {
  static propTypes = {
    backAction: PropTypes.func,
    color: PropTypes.string,
    containerStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    field: PropTypes.string,
    handlePress: PropTypes.func,
    navigation: PropTypes.object,
    testID: PropTypes.string,
    theme: PropTypes.object,
    touched: PropTypes.bool,
    touchedPath: PropTypes.string
  };

  static defaultProps = {
    backAction: () => {},
    testID: IDs
  };

  handlePress = throttledAction(() => {
    if (this.props.handlePress) {
      return this.props.handlePress();
    }
    Keyboard.dismiss();

    const { touchedPath, touched, theme } = this.props;
    if (touchedPath && touched) {
      return showConfirmationAlert({ theme, title: strings('alert.title.goBack'), handler: this.goBack });
    }
    return this.goBack();
  });

  goBack = () => {
    const { backAction, navigation } = this.props;
    if (backAction) { backAction(); }
    navigation.goBack(null);
  };

  render() {
    const { containerStyle, theme, color: Color, testID } = this.props;
    const { color } = theme;

    return (
      <TouchableOpacity
        onPress={this.handlePress}
        style={[styles.container, containerStyle]}
        hitSlop={touchableArea}
        testID={testID}
      >
        <Icon size={21} name="back" color={Color || color.primaryText} />
        {isIOS &&
          <Text style={[styles.text, { color: Color || color.primaryText }]}>
            {strings('header.button.back')}
          </Text>
        }
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state, props) => ({
  touched: !!get(state, props.touchedPath)
});

export default connect(mapStateToProps)(withTheme(BackBtn));
