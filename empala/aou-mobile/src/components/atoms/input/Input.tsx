import React, { useEffect } from 'react';
import { Keyboard, View } from 'react-native';

import * as s from './InputStyles';

import { Icon } from '~/components/atoms/icon';
import Theme from '~/theme';

type Props = {
  face?: s.InputFace;
  label?: string;
  error?: string;
  allowClear?: boolean;
  allowCheck?: boolean;
  allowSecureTextEntry?: boolean;
  value: string;
  onClose?: () => void;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  autoCompleteType?: 'name' | 'cc-csc' | 'cc-exp' | 'cc-exp-month' | 'cc-exp-year' | 'cc-number' | 'email'
  | 'password' | 'postal-code' | 'street-address' | 'tel' | 'username' | 'off' | undefined;
  textContentType?: 'none' | 'URL' | 'addressCity' | 'addressCityAndState' | 'addressState' | 'countryName'
  | 'creditCardNumber' | 'emailAddress' | 'familyName' | 'fullStreetAddress' | 'givenName' | 'jobTitle'
  | 'location' | 'middleName' | 'name' | 'namePrefix' | 'nameSuffix' | 'nickname' | 'organizationName'
  | 'postalCode' | 'streetAddressLine1' | 'streetAddressLine2' | 'sublocality' | 'telephoneNumber'
  | 'username' | 'password';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
  onFocus?: () => void;
  onBlur?: () => void;
};

export const Input = ({
  face,
  label,
  error,
  allowClear = false,
  allowCheck = false,
  allowSecureTextEntry = false,
  value,
  onClose,
  onChangeText,
  autoFocus = false,
  onFocus,
  onBlur,
  ...rest
}: Props): JSX.Element => {
  const [nvalue, setValue] = React.useState<string>(value);
  const [secureTextEntry, setSecureTextEntry] = React.useState<boolean>(allowSecureTextEntry);
  const [isFocused, setFocus] = React.useState<boolean>(autoFocus);
  const refInput = React.useRef(null);

  useEffect(() => {
    setValue(value);
  }, [value]);

  const handleChange = React.useCallback(
    (v) => {
      if (onChangeText) {
        onChangeText(v);
      }
      setValue(v);
    },
    [],
  );

  const handleFocus = React.useCallback(
    () => {
      setFocus(true);
      onFocus?.();
    },
    [],
  );

  const handleBlur = React.useCallback(
    () => {
      setFocus(false);
      onBlur?.();
    },
    [],
  );

  const handleSecure = React.useCallback(
    () => {
      setSecureTextEntry(!secureTextEntry);
    },
    [secureTextEntry],
  );

  const handleClear = React.useCallback(
    () => {
      if (onChangeText) {
        onChangeText('');
      }
      if (onClose) {
        onClose();
      }
      setValue('');
      setFocus(false);
      Keyboard.dismiss();
    },
    [],
  );

  return (
    <Theme>
      <s.Wrapper>
        <s.Container>
          <s.InputContainer focus={isFocused}>
            {label && nvalue?.length > 0 && <s.Label face={face}>{label}</s.Label>}
            <s.Input
              textAlign="center"
              ref={refInput}
              keyboardType="default"
              autoCapitalize="none"
              selectionColor="#ffffff60"
              placeholderTextColor="#ffffff60"
              underlineColorAndroid="transparent"
              onFocus={handleFocus}
              onBlur={handleBlur}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...rest}
              value={nvalue}
              onChangeText={handleChange}
              numberOfLines={1}
              secureTextEntry={secureTextEntry}
            />
            {allowClear && nvalue?.length > 0 && (
              <s.Btn onPress={handleClear}>
                <Icon name="close" size={24} color="#fff" />
              </s.Btn>
            )}
            {allowSecureTextEntry && nvalue?.length > 0 && (
              <s.Btn onPress={handleSecure}>
                <Icon name={secureTextEntry ? 'eye' : 'eyeClose'} size={24} color="#fff" />
              </s.Btn>
            )}
            {allowCheck && nvalue?.length > 0 && <Icon name="check" size={24} color="#fff" />}
          </s.InputContainer>
        </s.Container>
        {error && (
          <s.Error>
            <s.ErrorText>{error}</s.ErrorText>
          </s.Error>
        )}
      </s.Wrapper>
    </Theme>
  );
};
