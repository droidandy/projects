import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';

import { Popup } from '../Popup';

import styles from './style';

class AlertModal extends PureComponent {
  constructor(props) {
    super(props);
    AlertModal.context = this;
  }

  state = {
    title: '',
    message: ''
  };

  setPopupRef = (el) => { this.popup = el; };

  hide = () => { this.popup.close(); };

  closeWrapper = callback => () => {
    this.hide();
    if (callback) callback();
  };

  static show({ theme, buttons, ...rest }) {
    const btns = buttons.map((item) => {
      const onPress = AlertModal.context.closeWrapper(item.onPress);

      return { title: '', ...item, onPress };
    });
    const messageStyle = { color: theme.color.secondaryText };

    AlertModal.context.setState(
      { buttons: btns, messageStyle, ...rest },
      AlertModal.context.popup.open
    );
  }

  render() {
    const { title, titleStyle, message, messageStyle, buttons, testID } = this.state;

    return (
      <View style={styles.container}>
        <Popup
          innerRef={this.setPopupRef}
          title={title}
          titleStyle={[styles.titleStyle, titleStyle]}
          contentStyle={styles.contentStyle}
          buttons={buttons}
          content={(
            message &&
            <View style={styles.messageWrapper}>
              <Text style={[styles.messageStyle, messageStyle]}>
                {message}
              </Text>
            </View>
          )}
          testID={testID}
        />
      </View>
    );
  }
}

export default AlertModal;
