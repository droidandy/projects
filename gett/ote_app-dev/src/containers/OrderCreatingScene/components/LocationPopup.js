import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import { strings } from 'locales';

import { withTheme } from 'theme';
import { Popup } from 'components';

import { containers } from 'testIDs';

const IDs = containers.Orders;

const styles = StyleSheet.create({
  popupLocationTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginHorizontal: 0,
    marginBottom: 0
  }
});

class LocationPopup extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    popupRef: PropTypes.func
  };

  render() {
    const { popupRef, onPress } = this.props;
    return (
      <Popup
        innerRef={popupRef}
        titleStyle={styles.popupLocationTitle}
        title={strings('popup.locationService.title')}
        buttons={[
          {
            title: strings('popup.locationService.button.сancel'),
            type: 'secondary',
            testID: IDs.serviceResetBtn
          },
          {
            title: strings('popup.locationService.button.сonfirm'),
            onPress,
            testID: IDs.serviceSubmitBtn
          }
        ]}
        testID="locationService"
      />
    );
  }
}

export default withTheme(LocationPopup);
