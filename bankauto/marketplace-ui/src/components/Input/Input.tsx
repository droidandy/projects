import React, { ChangeEvent, FC, FocusEvent, ReactNode, useMemo } from 'react';
import NumberFormat from 'react-number-format';
import { FormControl, FormHelperText, InputLabel, TextField, Input, OutlinedInput } from '@material-ui/core';

import { ComponentProps } from '../../types/ComponentProps';
import { useStyles } from './Input.styles';

interface MaskedInputProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  format: string;
  useFormattedValue: boolean;
  [key: string]: any;
  suffix?: string;
}

function MaskedInput({
  name,
  inputRef,
  format,
  useFormattedValue,
  onChange,
  mask,
  ...rest
}: MaskedInputProps): JSX.Element {
  return (
    <NumberFormat
      {...rest}
      getInputRef={inputRef}
      name={name}
      onValueChange={(values) => {
        onChange({
          target: {
            name,
            value: useFormattedValue ? values.formattedValue : values.value,
          },
        });
      }}
      isNumericString={!useFormattedValue}
      format={format}
      mask={mask || '_'}
    />
  );
}

export interface Props extends ComponentProps {
  type?: string;
  placeholder?: string | Element | ReactNode;
  name?: string;
  value?: string | number | null;
  mask?: string;
  useFormattedValue?: boolean;
  error?: boolean;
  helperText?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  allowNegative?: boolean;
  needTrim?: boolean;
  [key: string]: any;
}

export const CoreInput: FC<Props> = ({
  type = 'text',
  placeholder,
  name,
  value,
  mask,
  useFormattedValue = false,
  error = false,
  helperText = '',
  startAdornment,
  endAdornment,
  handleChange,
  handleBlur,
  inputRef,
  variant = 'outlined',
  ...rest
}) => {
  const shrink = useMemo<boolean | undefined>(() => !!value || undefined, [value]);

  const classes = useStyles();
  const inputProps = mask
    ? {
        startAdornment,
        endAdornment,
        inputComponent: MaskedInput as any,
        inputProps: {
          format: mask,
          useFormattedValue,
          name,
        },
      }
    : {
        startAdornment,
        endAdornment,
      };

  return (
    <FormControl classes={classes} variant={variant} error={error} {...rest}>
      <InputLabel shrink={shrink}>{placeholder}</InputLabel>
      {variant === 'outlined' ? (
        <OutlinedInput
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          inputRef={inputRef}
          {...inputProps}
        />
      ) : (
        <Input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          inputRef={inputRef}
          {...inputProps}
        />
      )}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

const NumberFormatCustom: FC<MaskedInputProps> = (props) => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator={' '}
      isNumericString
    />
  );
};

type InputNumberProps = Props & {
  suffix?: string;
};

export const InputNumber: FC<InputNumberProps> = ({
  type = 'text',
  placeholder,
  name,
  value,
  mask,
  error = false,
  helperText = '',
  endAdornment,
  handleChange,
  allowNegative = false,
  handleBlur,
  variant = 'outlined',
  suffix,
  inputClasses,
  thousandSeparator,
  ...rest
}) => {
  const shrink = useMemo<boolean | undefined>(() => !!value || undefined, [value]);

  const classes = useStyles();

  return (
    <TextField
      classes={classes}
      type={type}
      label={placeholder}
      variant={variant}
      name={name}
      onChange={handleChange}
      onBlur={handleBlur}
      value={value}
      error={error}
      helperText={helperText}
      InputProps={{
        inputComponent: NumberFormatCustom as any,
        endAdornment,
        classes: inputClasses,
        inputProps: {
          allowNegative,
          suffix,
          thousandSeparator,
        },
      }}
      InputLabelProps={{ shrink }}
      {...rest}
    />
  );
};

export const InputPrice: FC<Props> = (props) => <InputNumber {...props} suffix=" ₽" />;
