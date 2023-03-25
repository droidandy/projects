import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, TouchableOpacity, BackHandler } from 'react-native';
import {
  Input,
  Icon,
  KeyboardAnimatedWrapper,
  KeyboardCustomAnimatedWrapper,
  DismissKeyboardView,
  Avatar
} from 'components';
import ImagePicker from 'react-native-image-crop-picker';
import { color, withTheme } from 'theme';

import { strings } from 'locales';

import { showConfirmationAlert } from 'utils';

import { setInitialProfileValues, changeProfileFieldValue, touchField } from 'actions/passenger';

import { containers } from 'testIDs';

import styles from './EditProfileStyles';

const IDs = containers.Settings.EditProfile;
const avatarPickerConfig = {
  cropping: true,
  width: 300,
  height: 300,
  mediaType: 'photo',
  includeBase64: true,
  // ios only
  smartAlbums: ['UserLibrary', 'PhotoStream'],
  showsSelectedCount: false,
  // android only
  showCropGuidelines: false,
  hideBottomControls: true,
  cropperCircleOverlay: true,
  cropperActiveWidgetColor: color.primaryText,
  cropperStatusBarColor: color.primaryText,
  cropperToolbarColor: color.primaryText
};

class EditProfile extends Component {
  static propTypes = {
    avatar: PropTypes.string,
    avatarUrl: PropTypes.string,
    changeProfileFieldValue: PropTypes.func,
    error: PropTypes.object,
    firstName: PropTypes.string,
    handleAvatarChange: PropTypes.func,
    handleFirstNameChange: PropTypes.func,
    handleLastNameChange: PropTypes.func,
    lastName: PropTypes.string,
    navigation: PropTypes.object,
    setInitialProfileValues: PropTypes.func,
    theme: PropTypes.object,
    themedStyles: PropTypes.object,
    touched: PropTypes.bool,
    touchField: PropTypes.func
  };

  static defaultProps = {
    firstName: '',
    lastName: ''
  };

  componentDidMount() {
    this.props.setInitialProfileValues();

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
    this.props.touchField('profile', false);

    this.backListener.remove();

    BackHandler.removeEventListener('backPress');
  }

  goBack = () => this.props.navigation.goBack(null);

  openAvatarPicker = () => {
    ImagePicker.openPicker(avatarPickerConfig).then((image) => {
      this.props.handleAvatarChange(`data:${image.mime};base64,${image.data}`);
    });
  };

  renderInput = ({ item, label, onChangeText, ...rest }) => {
    const { error, themedStyles } = this.props;

    return (
      <Input
        key={item}
        value={this.props[item]}
        error={error && error[item]}
        onChangeText={onChangeText}
        placeholder={label}
        style={themedStyles.inputContainer}
        onBlur={() => onChangeText((this.props[item] || '').trim())}
        inputStyle={themedStyles.input}
        clearIconStyle={themedStyles.clearIcon}
        maxLength={30}
        {...rest}
      />
    );
  };

  render() {
    const { avatarUrl, avatar, handleFirstNameChange, handleLastNameChange, themedStyles } = this.props;

    const inputs = [
      {
        clearIconTestID: IDs.clearFirstName,
        item: 'firstName',
        label: 'First Name',
        onChangeText: handleFirstNameChange,
        testID: IDs.firstName
      },
      {
        clearIconTestID: IDs.clearLastName,
        item: 'lastName',
        label: 'Last Name',
        onChangeText: handleLastNameChange,
        testID: IDs.lastName
      }
    ];

    const userAvatar = avatar || avatarUrl;

    return (
      <DismissKeyboardView style={[themedStyles.flex, themedStyles.container]}>
        <KeyboardAnimatedWrapper testID={IDs.editProfile}>
          <TouchableOpacity
            activeOpacity={0.4}
            style={themedStyles.cameraWrapper}
            onPress={this.openAvatarPicker}
            testID={IDs.avatar}
          >
            <Avatar
              size={140}
              source={userAvatar}
            />
            <View style={themedStyles.avatarBackDrop}/>
            <Icon style={themedStyles.cameraIcon} size={32} color={color.white} name="camera"/>
          </TouchableOpacity>
        </KeyboardAnimatedWrapper>
        <KeyboardCustomAnimatedWrapper value={-200}>
          {inputs.map(this.renderInput)}
        </KeyboardCustomAnimatedWrapper>
      </DismissKeyboardView>
    );
  }
}

const mapStateToProps = ({ passenger }) => ({
  avatar: passenger.temp.avatar,
  avatarUrl: passenger.temp.avatarUrl,
  error: passenger.temp.validationError,
  firstName: passenger.temp.firstName,
  lastName: passenger.temp.lastName,
  touched: passenger.temp.profileTouched
});

const mapDispatchToProps = {
  handleAvatarChange: changeProfileFieldValue('avatar'),
  handleFirstNameChange: changeProfileFieldValue('firstName'),
  handleLastNameChange: changeProfileFieldValue('lastName'),
  setInitialProfileValues,
  touchField
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(EditProfile, styles));
