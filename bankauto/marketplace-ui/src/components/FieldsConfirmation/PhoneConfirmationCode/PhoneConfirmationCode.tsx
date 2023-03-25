import React, { FC, useState, useCallback, useEffect, useRef, useMemo, ChangeEvent } from 'react';
import { Tooltip } from '@material-ui/core';
import { InputBase } from '@marketplace/ui-kit';
import { ReactComponent as IconSuccess } from 'icons/iconSuccess.svg';
import { ReactComponent as IconError } from 'icons/iconError.svg';
import { ComponentProps } from 'types/ComponentProps';

type Props = ComponentProps & {
  name: string;
  handleConfirm: (value: string) => void;
  variant?: 'standard' | 'filled' | 'outlined';
  isConfirmed?: boolean;
  disabled?: boolean;
  area?: string;
  error?: string;
  touched?: boolean;
  loading?: boolean;
};

const PhoneConfirmationCode: FC<Props> = ({
  handleConfirm,
  error,
  touched,
  loading,
  isConfirmed,
  disabled,
  ...rest
}) => {
  const [codeError, setCodeError] = useState<string | undefined>(error);
  const [codeTouched, setCodeTouched] = useState(touched);
  const ref = useRef<HTMLInputElement>();

  // инпут тачед пока не начался ввод
  useEffect(() => {
    if (touched) {
      setCodeTouched(true);
    }
  }, [touched, setCodeTouched]);

  const handleChangeCode = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setCodeTouched(false);
      const { value } = e.target;
      const isValid = value.length === 4;

      setCodeError(isValid ? undefined : 'Код должен состоять из 4 символов');

      if (isValid) {
        handleConfirm(value);
      }
    },
    [setCodeTouched, setCodeError, handleConfirm],
  );
  const handleFocusCode = () => {
    setCodeTouched(false);
  };
  const handleBlurCode = () => {
    setCodeTouched(true);
  };
  useEffect(() => {
    if (!disabled && ref) {
      ref.current?.focus();
    }
  }, [disabled, ref]);
  useEffect(() => {
    if (error) {
      setCodeTouched(true);
      setCodeError(undefined);
      if (ref.current) ref.current.value = '';
    }
  }, [ref, error, setCodeTouched]);

  const endAdornment = useMemo(() => {
    if (isConfirmed) return <IconSuccess />;
    if (codeTouched && (codeError || error)) {
      return (
        <Tooltip title={codeError || error || ''} enterTouchDelay={0} placement="top-end">
          <div style={{ cursor: 'pointer' }}>
            <IconError />
          </div>
        </Tooltip>
      );
    }
    return undefined;
  }, [isConfirmed, error, codeTouched, codeError]);

  return (
    <InputBase
      type="password"
      error={(!!error || !!codeError) && codeTouched && !isConfirmed}
      inputRef={ref}
      placeholder="SMS код"
      onChange={handleChangeCode}
      onFocus={handleFocusCode}
      onBlur={handleBlurCode}
      InputLabelProps={{ shrink: !disabled }}
      InputProps={{
        endAdornment,
        inputProps: {
          maxLength: 4,
          autocomplete: 'new-password',
        },
      }}
      disabled={loading || isConfirmed || disabled}
      {...rest}
    />
  );
};

export default PhoneConfirmationCode;
