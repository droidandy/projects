import React, { useEffect } from 'react';

import * as s from './SearchStyles';

import { Icon } from '~/components/atoms/icon';
import Theme from '~/theme';

type Props = {
  value: string;
  placeholder?: string;
  autoFocus?: boolean;
  onChangeText?: (value: string) => void;
};

export const Search = ({
  value,
  autoFocus = true,
  onChangeText,
  ...rest
}: Props): JSX.Element => {
  const [nvalue, setValue] = React.useState<string>(value);
  const [focused, setFocus] = React.useState<boolean>(autoFocus);
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
    [onChangeText],
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
      <s.Wrapper>
        <s.Container>
          <s.InputContainer>
            <s.Input
              ref={refInput}
              keyboardType="default"
              autoCapitalize="none"
              selectionColor="#ffffff60"
              placeholderTextColor="#ffffff60"
              underlineColorAndroid="transparent"
              numberOfLines={1}
              {...rest}
              value={nvalue}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChangeText={handleChange}
            />
            <Icon name="loupe" size={24} color="#fff" />
          </s.InputContainer>
        </s.Container>
      </s.Wrapper>
    </Theme>
  );
};
