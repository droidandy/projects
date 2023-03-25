import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import Modal from 'react-native-modal';
import { isString } from 'lodash';

import { Button } from 'components';
import { strings } from 'locales';

import { withTheme } from 'theme';

import { deviceWidth, deviceHeight } from 'utils';

import styles from './style';

class Popup extends PureComponent {
  static propTypes = {
    buttons: PropTypes.array,
    containerStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    content: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    contentStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    contentWrapperStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    footerStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    icon: PropTypes.node,
    testID: PropTypes.string,
    theme: PropTypes.object,
    themedStyles: PropTypes.object,
    title: PropTypes.string,
    titleStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
  };

  static defaultProps = {
    containerStyle: {},
    content: '',
    contentStyle: {},
    footerStyle: {},
    title: ''
  };

  state = {
    isVisible: false
  };

  open = () => {
    this.setState({ isVisible: true });
  };

  close = () => {
    this.setState({ isVisible: false });
  };

  renderButton = ({ onPress = this.close, title = '', type, testID } = {}, index) => (
    <Button
      key={index}
      title={title || strings('alert.button.ok').toUpperCase()}
      type={type}
      onPress={onPress}
      style={this.props.themedStyles.btn}
      stretched
      size="mid"
      testID={testID}
    />
  );

  renderContent = () => {
    const {
      contentStyle,
      titleStyle,
      contentWrapperStyle,
      footerStyle,
      title,
      content,
      buttons,
      icon,
      themedStyles
    } = this.props;

    return (
      <View style={[themedStyles.content, contentWrapperStyle]}>
        {icon}
        {isString(title) &&
          <Text style={[themedStyles.title, titleStyle]}>{title}</Text>
        }
        {isString(content)
          ? <Text style={[themedStyles.description, contentStyle]}>{content}</Text>
          : content
        }
        <View style={[themedStyles.footer, footerStyle]}>
          {buttons ? buttons.map(this.renderButton) : this.renderButton()}
        </View>
      </View>
    );
  };

  render() {
    const { containerStyle, testID, theme, themedStyles } = this.props;

    return (
      <Modal
        isVisible={this.state.isVisible}
        style={[themedStyles.container, containerStyle]}
        backdropColor={theme.color.backdrop}
        testID={testID}
        deviceWidth={deviceWidth}
        deviceHeight={deviceHeight}
      >
        {this.renderContent()}
      </Modal>
    );
  }
}

export default withTheme(Popup, styles);
