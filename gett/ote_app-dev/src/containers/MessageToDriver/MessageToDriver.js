import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, TouchableOpacity, Text } from 'react-native';
import { Input, Divider } from 'components';
import { saveMessageToDriver, changeMessageToDriver } from 'actions/booking';
import { withTheme } from 'theme';
import { strings } from 'locales';
import { throttledAction } from 'utils';
import { containers } from 'testIDs';
import styles from './styles';

const defaultPhrases = [
  strings('messageToDriver.text.callOnArrival'),
  strings('messageToDriver.text.doNotCall'),
  strings('messageToDriver.text.meetAtArrivals'),
  strings('messageToDriver.text.ringDoorOnArrival'),
  strings('messageToDriver.text.parkAndWait'),
  strings('messageToDriver.text.ifLateCallMe')
];

const IDs = containers.SearchModal;

class MessageToDriver extends PureComponent {
  static propTypes = {
    booking: PropTypes.object,
    changeMessageToDriver: PropTypes.func.isRequired,
    message: PropTypes.string,
    onChangeText: PropTypes.func,
    onClose: PropTypes.func,
    saveMessageToDriver: PropTypes.func.isRequired,
    theme: PropTypes.object,
    themedStyles: PropTypes.object,
    touched: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.handlers = {};
    defaultPhrases.forEach((phrase) => {
      this.handlers[phrase] = () => this.onPhrasePress(phrase);
    });
  }

  setInputRef = (el) => { this.input = el; };

  onChangeText = message => this.props.changeMessageToDriver(message, true);

  handleMessageSave = throttledAction(() => {
    const { saveMessageToDriver, onClose, touched, message } = this.props;
    onClose();

    if (touched) {
      setTimeout(() => saveMessageToDriver(message, true), 350); // for smooth animation
    }
  });

  onPhrasePress = (item) => {
    this.input.focus();
    this.onChangeText(item);
  };

  renderPhrase = (item, index) => (
    <TouchableOpacity key={index} onPress={this.handlers[item]} testID={`${IDs.list}[${index}]`}>
      <Text style={this.props.themedStyles.phrase}>{item}</Text>
    </TouchableOpacity>
  );

  render() {
    const { booking, theme, touched, message, themedStyles } = this.props;
    const value = touched ? message : booking.message;

    return (
      <View style={themedStyles.flex}>
        <View style={themedStyles.header}>
          <Input
            inputRef={this.setInputRef}
            returnKeyLabel="Done"
            returnKeyType="done"
            blurOnSubmit
            value={value}
            onChangeText={this.onChangeText}
            onSubmitEditing={this.handleMessageSave}
            autoCorrect={false}
            autoFocus
            maxLength={225}
            multiline
            allowedError={false}
            placeholder={strings('app.label.startTypeMessage')}
            placeholderTextColor={theme.color.secondaryText}
            style={themedStyles.input}
            borderLess
            inputStyle={themedStyles.inputStyle}
            testID={IDs.input}
          />
          <Divider left={0} />
        </View>
        <View style={themedStyles.phraseWrapper} testID={IDs.list}>
          {!value && defaultPhrases.map(this.renderPhrase)}
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ booking }) => ({
  message: booking.tempMessageToDriver,
  touched: booking.messageToDriverTouched
});

const mapDispatchToProps = ({
  changeMessageToDriver,
  saveMessageToDriver
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(MessageToDriver, styles));
