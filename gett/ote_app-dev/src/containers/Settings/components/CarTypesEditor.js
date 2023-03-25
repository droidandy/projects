import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, BackHandler, Text, TouchableWithoutFeedback, ScrollView } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { setInitialProfileValues, changeProfileFieldValue, touchField } from 'actions/passenger';

import { Icon, Modal, CheckBox, CarImage } from 'components';

import { baseVehicles, baseVehiclesDescriptions } from 'containers/shared/bookings/data';

import { strings } from 'locales';

import { withTheme } from 'theme';

import { showConfirmationAlert } from 'utils';

import styles from './CarTypesEditorStyles';

class CarTypesEditor extends Component {
  static propTypes = {
    changeProfileFieldValue: PropTypes.func,
    input: PropTypes.string,
    navigation: PropTypes.object,
    setInitialProfileValues: PropTypes.func,
    theme: PropTypes.object,
    themedStyles: PropTypes.object,
    touched: PropTypes.bool,
    touchField: PropTypes.func,
    vehicle: PropTypes.string
  };

  static defaultProps = {
    input: ''
  };

  state = {
    isModalVisible: false,
    currentCar: ''
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

  handleOpenInfo = (name) => {
    this.setState({ isModalVisible: true, currentCar: name });
  };

  closeInfo = () => {
    this.setState({ isModalVisible: false, currentCar: '' });
  };

  renderInfoModal = () => {
    const { themedStyles, theme } = this.props;
    const { currentCar } = this.state;
    const label = (baseVehicles.find(vehicle => vehicle.name === currentCar) || {}).label;
    const info = baseVehiclesDescriptions[currentCar] || {};
    const features = info.features || [];

    const CAR_ANIMATION_DURATION = 800;
    const OPTION_ANIMATION_DURATION = 1500;
    const OPTIONS_DELAY = CAR_ANIMATION_DURATION * 2;

    return (
      <Modal
        gesturesEnabled
        isVisible={this.state.isModalVisible}
        onClose={this.closeInfo}
        contentStyles={themedStyles.modalContent}
      >
        <View style={themedStyles.modalWrapper}>
          <Text style={themedStyles.modalHeader}>{label}</Text>

          <CarImage
            style={themedStyles.carWrapper}
            size="big"
            type={currentCar}
            animatable
            duration={CAR_ANIMATION_DURATION}
          />

          <Text style={themedStyles.modalDesc}>{info.description}</Text>

          <View style={themedStyles.featuresBlock}>
            {features.map((feature, index) => (
              <View key={feature} style={themedStyles.featuresItem}>
                <View style={themedStyles.checkmark}>
                  <Icon name="check" width={13} height={10} color={theme.color.primaryText} />
                  <Animatable.View
                    style={themedStyles.checkmarkHider}
                    animation="slideOutRight"
                    delay={OPTIONS_DELAY + (index * 300)}
                    duration={OPTION_ANIMATION_DURATION}
                  />
                </View>

                <Animatable.Text
                  style={themedStyles.featuresLabel}
                  animation="fadeIn"
                  delay={OPTIONS_DELAY + (index * 300)}
                  duration={OPTION_ANIMATION_DURATION}
                >
                  {feature}
                </Animatable.Text>
              </View>
            ))}
          </View>

          <Animatable.Text
            style={themedStyles.feesDesc}
            animation="fadeIn"
            delay={OPTIONS_DELAY + (features.length * 300)}
            duration={OPTION_ANIMATION_DURATION}
          >
            {info.price}
          </Animatable.Text>
        </View>
      </Modal>
    );
  };

  renderCarItem = ({ name, label }) => {
    const { themedStyles, theme } = this.props;
    const isSelected = this.props.vehicle === name;
    const handler = this.props.changeProfileFieldValue.bind(null, 'defaultVehicle', name);

    return (
      <TouchableWithoutFeedback
        key={name}
        onPress={handler}
      >
        <View style={themedStyles.itemContainer}>
          <View style={themedStyles.button}>
            <CheckBox status={isSelected} onPress={handler} />
          </View>

          <CarImage type={name} style={themedStyles.image} size="small" />

          <Text style={themedStyles.label}>{label}</Text>
          <TouchableWithoutFeedback onPress={this.handleOpenInfo.bind(null, name)}>
            <View style={themedStyles.button}>
              <Icon name="vehicleInfo" color={theme.color.primaryText} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    const { themedStyles } = this.props;
    return (
      <View style={[themedStyles.flex, themedStyles.container]}>
        <ScrollView style={themedStyles.flex}>
          {baseVehicles.map(this.renderCarItem)}
        </ScrollView>

        {this.renderInfoModal()}
      </View>
    );
  }
}

const mapStateToProps = ({ passenger }) => ({
  touched: passenger.temp.profileTouched,
  vehicle: passenger.temp.defaultVehicle
});

const mapDispatchToProps = {
  changeProfileFieldValue,
  setInitialProfileValues,
  touchField
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CarTypesEditor, styles));
