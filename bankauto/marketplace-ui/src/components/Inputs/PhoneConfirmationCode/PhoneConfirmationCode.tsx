import React, { FC, useState, useCallback, useEffect, useRef, useMemo, ChangeEvent } from 'react';
import { Tooltip } from '@material-ui/core';
import Input from '@marketplace/ui-kit/components/Input';
import { ReactComponent as IconSuccess } from 'icons/iconSuccess.svg';
import { ReactComponent as IconError } from 'icons/iconError.svg';
import { ComponentProps } from 'types/ComponentProps';

interface Props extends ComponentProps {
  handleConfirm: (value: string) => void;
  isConfirmed?: boolean;
  name: string;
  variant?: string;
  area?: string;
  error?: string;
  touched?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

const RegisterByPhoneForm: FC<Props> = ({
  area,
  name,
  handleConfirm,
  error,
  touched,
  loading,
  disabled,
  isConfirmed,
  variant,
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
    <Input
      type="password"
      variant={variant || 'outlined'}
      error={(!!error || !!codeError) && codeTouched && !isConfirmed}
      inputRef={ref}
      area={area}
      name={name}
      placeholder="SMS код"
      onChange={handleChangeCode}
      onFocus={handleFocusCode}
      handleBlur={handleBlurCode}
      InputProps={{
        endAdornment,
        inputProps: {
          maxLength: 4,
          autocomplete: 'new-password',
        },
      }}
      disabled={loading || isConfirmed || disabled}
    />
  );
};

export default RegisterByPhoneForm;
