import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { color, withTheme } from 'theme';

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 20,
    height: 50
  },
  btnDisabled: {
    opacity: 0.5
  },
  title: {
    color: color.primaryText,
    fontWeight: 'bold',
    fontSize: 18
  },
  spinner: {
    marginHorizontal: 10
  }
});

const Button = (props) => {
  const {
    styleContent,
    children,
    size,
    raised,
    stretched,
    disabled,
    disabledStyle,
    loading,
    title,
    type,
    theme,
    ...rest
  } = props;

  let computedStyles = styles.btn;
  let computedTitleStyles = styles.title;

  switch (size) {
    case 'sm': {
      computedStyles = {
        ...computedStyles,
        height: 34,
        borderRadius: 6,
        paddingHorizontal: 14
      };
      computedTitleStyles = {
        ...computedTitleStyles,
        fontSize: 15
      };
      break;
    }
    case 'mid': {
      computedStyles = {
        ...computedStyles,
        height: 44,
        borderRadius: 6
      };
      computedTitleStyles = {
        ...computedTitleStyles,
        fontSize: 15
      };
      break;
    }
    default: {
      break;
    }
  }

  switch (type) {
    case 'primary': {
      computedStyles = {
        ...computedStyles,
        backgroundColor: theme.color.primaryBtns
      };
      break;
    }
    case 'secondary': {
      computedStyles = {
        ...computedStyles,
        backgroundColor: theme.color.secondaryBtns
      };
      computedTitleStyles = {
        ...computedTitleStyles,
        color: theme.isNightMode ? color.white : color.primaryText
      };
      break;
    }
    default: {
      break;
    }
  }

  if (raised) {
    computedStyles = {
      ...computedStyles,
      elevation: 2,
      shadowColor: color.black,
      shadowOpacity: 0.2,
      shadowRadius: 5,
      shadowOffset: {
        height: 0
      }
    };
  }

  if (stretched) {
    computedStyles = {
      ...computedStyles,
      alignSelf: 'stretch'
    };
  }

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      disabled={disabled}
      {...rest}
    >
      <View style={[computedStyles, styleContent, disabled && [styles.btnDisabled, disabledStyle]]}>
        {loading && <ActivityIndicator style={styles.spinner} size="small" color={theme.color.primaryText} />}
        {children}
        {title && <Text style={[computedTitleStyles, disabled && styles.titleDisable]}>{title}</Text>}
      </View>
    </TouchableOpacity>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  disabledStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  loading: PropTypes.bool,
  raised: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'mid']),
  stretched: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  styleContent: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  theme: PropTypes.object,
  title: PropTypes.string,
  type: PropTypes.oneOf(['primary', 'secondary'])
};

Button.defaultProps = {
  raised: true,
  type: 'primary'
};

export default withTheme(Button);
