import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TextInput, View, Animated, TouchableOpacity, Text } from 'react-native';
import TextInputMask from 'react-native-text-input-mask';

import { Icon } from 'components';

import { color, withTheme } from 'theme';

import { isIOS } from 'utils';

import styles from './style';

const labelFontSizeValues = [17, 14];
const labelTopValues = [10, -12];

class Input extends PureComponent {
  constructor(props) {
    super(props);
    const stateIndex = +!!(props.value || props.placeholder).length;
    this.labelFontSize = new Animated.Value(labelFontSizeValues[stateIndex]);
    this.labelTop = new Animated.Value(labelTopValues[stateIndex]);
  }

  static propTypes = {
    allowClear: PropTypes.bool,
    allowedError: PropTypes.bool,
    allowHelp: PropTypes.bool,
    allowmask: PropTypes.bool,
    borderLess: PropTypes.bool,
    clearIconColor: PropTypes.string,
    clearIconStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    clearIconTestID: PropTypes.string,
    containerStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    editable: PropTypes.bool,
    error: PropTypes.array,
    errorStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    helpIcon: PropTypes.node,
    helpIconColor: PropTypes.string,
    helpIconName: PropTypes.string,
    helpIconStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    helpIconTestID: PropTypes.string,
    helpPress: PropTypes.func,
    inputRef: PropTypes.func,
    inputStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    label: PropTypes.string,
    labelStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    onChangeText: PropTypes.func,
    onFocus: PropTypes.func,
    placeholder: PropTypes.string,
    style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    testID: PropTypes.string,
    theme: PropTypes.object,
    themedStyles: PropTypes.object,
    value: PropTypes.string
  };

  static defaultProps = {
    allowClear: true,
    allowedError: true,
    borderLess: false,
    clearIconColor: color.arrowRight,
    editable: true,
    placeholder: ''
  };

  componentDidUpdate(prevProps) {
    if ((!prevProps.value.length && !!this.props.value.length)) {
      this.moveLabelUp();
    }
  }

  moveLabelUp() {
    this.labelAnimated({
      toValues: { labelFontSize: labelFontSizeValues[1], labelTop: labelTopValues[1] },
      duration: 500
    });
  }

  handleFocus = () => {
    this.moveLabelUp();
    if (this.props.onFocus) {
      this.props.onFocus();
    }

    if (this.input) {
      this.input.focus();
    }
  };

  labelAnimated = ({ toValues, duration }) => {
    Animated.parallel([
      Animated.spring(this.labelFontSize, {
        toValue: toValues.labelFontSize,
        duration
      }),
      Animated.spring(this.labelTop, {
        toValue: toValues.labelTop,
        duration
      })
    ]).start();
  };

  handleBlur = () => {
    if (!this.props.value && !this.props.placeholder) {
      this.labelAnimated({
        toValues: { labelFontSize: labelFontSizeValues[0], labelTop: labelTopValues[0] },
        duration: 300
      });
    }
  };

  handleClear = () => {
    this.props.onChangeText('');
    this.handleFocus();
  };

  renderHelpOption = () => {
    const {
      allowmask,
      allowHelp,
      helpIcon,
      helpIconName,
      helpIconColor,
      helpIconTestID,
      helpPress,
      helpIconStyle,
      themedStyles
    } = this.props;

    return allowmask && allowHelp && (
      <TouchableOpacity
        activeOpacity={0.6}
        style={[themedStyles.clearBtn, helpIconStyle]}
        onPress={helpPress}
        testID={helpIconTestID}
      >
        {helpIcon || <Icon name={helpIconName || 'help'} size={24} color={helpIconColor} />}
      </TouchableOpacity>
    );
  };

  renderClearOption = () => {
    const {
      allowmask,
      allowClear,
      clearIconColor,
      clearIconStyle,
      clearIconTestID,
      themedStyles,
      value
    } = this.props;

    return !allowmask && allowClear &&
      value.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.6}
          style={[themedStyles.clearBtn, clearIconStyle]}
          onPress={this.handleClear}
          testID={clearIconTestID}
        >
          <Icon name="clear" size={16} color={clearIconColor} />
        </TouchableOpacity>
    );
  };

  renderError = () => {
    const {
      allowedError,
      error,
      errorStyle,
      themedStyles,
      testID
    } = this.props;

    if (!allowedError) return null;

    return error
      ? <Text style={[themedStyles.errorMessage, errorStyle]} testID={`${testID}Error`}>{error[0]}</Text>
      : <View style={themedStyles.errorPlaceholder} />;
  };

  renderLabel = () => {
    const { label, labelStyle, themedStyles } = this.props;

    const labelStyles = [
      themedStyles.label,
      labelStyle,
      {
        fontSize: this.labelFontSize,
        transform: [{ translateY: this.labelTop }]
      }
    ];
    return label && <Animated.Text style={labelStyles}>{label}</Animated.Text>;
  };

  setInputRef = (el) => {
    if (this.props.inputRef) {
      this.props.inputRef(el);
    }
    this.input = el;
  };

  renderInput = () => {
    const {
      allowmask,
      inputStyle,
      theme,
      themedStyles,
      editable,
      value,
      testID,
      ...rest
    } = this.props;

    const Input = allowmask ? TextInputMask : TextInput;

    rest[allowmask ? 'refInput' : 'ref'] = this.setInputRef;

    if (isIOS || !rest.mask) {
      rest.testID = testID;
    }

    return editable
      ? <Input
        selectionColor={color.arrowRight}
        {...rest}
        value={value}
        style={[themedStyles.input, inputStyle]}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        placeholderTextColor={theme.color.secondaryText}
        underlineColorAndroid="transparent"
        keyboardAppearance={theme.isNightMode ? 'dark' : 'default'}
      />
      : <Text style={[themedStyles.input, inputStyle]} testID={testID}>{value}</Text>;
  }

  render() {
    const {
      style,
      error,
      themedStyles,
      containerStyle,
      borderLess
    } = this.props;

    const containerStyles = [
      themedStyles.container,
      !borderLess && themedStyles.bottomBorder,
      containerStyle,
      error && themedStyles.error
    ];

    return (
      <View style={style}>
        {this.renderLabel()}
        <View style={containerStyles}>
          {this.renderInput()}
          {this.renderClearOption()}
          {this.renderHelpOption()}
        </View>
        {this.renderError()}
      </View>
    );
  }
}

export default withTheme(Input, styles);
