import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';

import { strings } from 'locales';
import { withTheme } from 'theme';
import { Popup } from 'components';

const styles = theme => StyleSheet.create({
  serviceSuspendedTitle: {
    textAlign: 'center',
    fontWeight: '600'
  },
  serviceSuspendedDescription: {
    fontSize: 17,
    lineHeight: 20,
    color: theme.color.secondaryText
  },
  serviceSuspendedGreeting: {
    marginBottom: 10
  },
  serviceSuspendedSign: {
    marginVertical: 12,
    fontSize: 17,
    fontStyle: 'italic',
    lineHeight: 20,
    color: theme.color.secondaryText
  }
});

class ServiceSuspendedPopup extends PureComponent {
  static propTypes = {
    popupRef: PropTypes.func,
    themedStyles: PropTypes.object
  };

  render() {
    const { themedStyles, popupRef } = this.props;
    return (
      <Popup
        innerRef={popupRef}
        title={strings('popup.serviceSuspended.title')}
        titleStyle={themedStyles.serviceSuspendedTitle}
        content={(
          <View>
            <Text style={[themedStyles.serviceSuspendedDescription, themedStyles.serviceSuspendedGreeting]}>
              {strings('popup.serviceSuspended.greeting')}
            </Text>
            <Text style={themedStyles.serviceSuspendedDescription}>
              {strings('popup.serviceSuspended.description')}
            </Text>
            <Text style={themedStyles.serviceSuspendedSign}>
              {strings('popup.serviceSuspended.sign')}
            </Text>
          </View>
        )}
      />
    );
  }
}

export default withTheme(ServiceSuspendedPopup, styles);
