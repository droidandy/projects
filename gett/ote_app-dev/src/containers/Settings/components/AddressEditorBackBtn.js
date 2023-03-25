import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { BackHandler } from 'react-native';
import { connect } from 'react-redux';

import { setValidationError, touchField, setTempAddress } from 'actions/passenger';
import { BackBtn } from 'components';
import { withTheme } from 'theme';
import { showConfirmationAlert, throttledAction } from 'utils';
import { strings } from 'locales';
import { containers } from 'testIDs';

const IDs = containers.Settings.AddressEditor;

class AddressEditorBackBtn extends PureComponent {
  static propTypes = {
    navigation: PropTypes.object,
    setTempAddress: PropTypes.func,
    setValidationError: PropTypes.func,
    theme: PropTypes.object,
    touched: PropTypes.bool,
    touchField: PropTypes.func
  };

  componentDidMount() {
    this.backListener = BackHandler.addEventListener('backPress', () => {
      const { touched, theme } = this.props;

      if (touched) {
        showConfirmationAlert({ theme, title: strings('alert.title.goBack'), handler: this.goBack });
        return true;
      }

      this.goBack();
      return true;
    });
  }

  componentWillUnmount() {
    this.backListener.remove();

    BackHandler.removeEventListener('backPress');
  }

  goBack = throttledAction(() => {
    this.handleBackPress();
    this.props.navigation.goBack(null);
  });

  handleBackPress = () => {
    const { setValidationError, touchField, setTempAddress } = this.props;
    touchField('address', false);
    setValidationError('temp.addressErrors', {});
    setTimeout(() => setTempAddress({}), 300);
  };

  render() {
    const { navigation } = this.props;
    return (
      <BackBtn
        navigation={navigation}
        backAction={this.handleBackPress}
        touchedPath="passenger.temp.addressTouched"
        testID={IDs.backBtn}
      />
    );
  }
}

const mapStateToProps = ({ passenger }) => ({
  touched: passenger.temp.addressTouched
});

const mapDispatchToProps = {
  setTempAddress,
  setValidationError,
  touchField
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(AddressEditorBackBtn));
