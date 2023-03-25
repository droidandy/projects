import React, { useEffect } from 'react';
import { Keyboard } from 'react-native';

import * as s from './SearchBoxStyles';

import { Icon } from '~/components/atoms/icon';
import Theme from '~/theme';

type Props = {
  allowClear?: boolean;
  value: string;
  onClose?: () => void;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
};

export const SearchBox = ({
  allowClear = true,
  value,
  onClose,
  onChangeText,
  autoFocus = false,
  ...rest
}: Props): JSX.Element => {
  const [nvalue, setValue] = React.useState<string>(value);
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

  const handleClose = React.useCallback(
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

  const handleFocus = React.useCallback(
    () => {
      setFocus(true);
    },
    [],
  );

  const handleBlur = React.useCallback(
    () => {
      setFocus(false);
    },
    [],
  );

  return (
    <Theme>
      <s.Container>
        <s.InputContainer focus={isFocused}>
          <Icon name="loupe" size={25} color="#fff" />
          <s.Input
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
          />
        </s.InputContainer>
        {allowClear && nvalue?.length > 0 && (
          <s.Close onPress={handleClose}>
            <Icon name="close" size={34} color="#fff" />
          </s.Close>
        )}
      </s.Container>
    </Theme>
  );
};
