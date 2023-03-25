import React, { ChangeEvent, FC, useContext } from 'react';
import {
  CoreInput as BaseInput,
  InputNumber as BaseInputNumber,
  InputPrice as BaseInputPrice,
  Props as InputProps,
} from 'components/Input/Input';
import { FieldProps, Field } from 'react-final-form';
import {
  InputPhone as InputPhoneBase,
  InputVehicleVIN,
  InputVehicleNumber as InputVehicleN,
} from '@marketplace/ui-kit';
import DateFnsUtils from '@date-io/date-fns';
import ruLocale from 'date-fns/locale/ru';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
  KeyboardDatePicker,
  KeyboardTimePicker,
} from '@material-ui/pickers';
import { iconCalendarForForm as IconCalendar } from 'icons';
import { capitalizeInputValue, uppercaseInputValue } from 'helpers';
import { MaskedInput } from 'components';
import { MaskedInputProps } from 'components/MaskedInput/MaskedInput';
import { FieldsetContext } from './Fieldset';

const Input: FC<FieldProps<any, any> & InputProps> = ({
  name,
  capitalize,
  uppercase,
  onBlur,
  needTrim = true,
  ...rest
}) => {
  const isDisabledFromFieldset = useContext(FieldsetContext);
  const isDisabled = isDisabledFromFieldset || rest.disabled;
  const changeValueAction = capitalize ? capitalizeInputValue : uppercase ? uppercaseInputValue : null;

  return (
    <Field name={name} {...rest}>
      {({ input, meta }) => (
        <BaseInput
          error={!isDisabled && meta.touched && !!meta.error}
          helperText={meta.touched && meta.error ? (meta.error[0] as string) : undefined}
          name={input.name}
          value={input.value}
          handleBlur={() => {
            onBlur?.();
            if (needTrim) input.onChange(input.value.trim());
            input.onBlur();
          }}
          handleChange={changeValueAction ? changeValueAction(input.onChange) : input.onChange}
          variant="standard"
          disabled={isDisabledFromFieldset || rest.disabled}
          {...rest}
        />
      )}
    </Field>
  );
};

const InputPrice: FC<FieldProps<any, any> & InputProps & { isInstalment?: boolean }> = ({
  name,
  isInstalment = false,
  onBlur,
  ...rest
}) => {
  const isDisabledFromFieldset = useContext(FieldsetContext);
  const isDisabled = isDisabledFromFieldset || rest.disabled;

  return (
    <Field name={name}>
      {({ input, meta }) => (
        <BaseInputPrice
          error={!isDisabled && meta.touched && !!meta.error}
          helperText={meta.touched && meta.error ? (meta.error[0] as string) : undefined}
          name={input.name}
          value={input.value}
          handleBlur={() => {
            onBlur?.();
            input.onBlur();
          }}
          handleChange={input.onChange}
          variant="standard"
          disabled={isDisabled}
          isInstalment={isInstalment}
          {...rest}
        />
      )}
    </Field>
  );
};

const InputNumber: FC<FieldProps<any, any> & InputProps> = ({ name, onBlur, ...rest }) => {
  const isDisabledFromFieldset = useContext(FieldsetContext);
  const isDisabled = isDisabledFromFieldset || rest.disabled;
  return (
    <Field name={name}>
      {({ input, meta }) => (
        <BaseInputNumber
          error={!isDisabled && meta.touched && !!meta.error}
          helperText={meta.touched && meta.error ? (meta.error[0] as string) : undefined}
          name={input.name}
          value={input.value}
          handleBlur={() => {
            onBlur?.();
            input.onBlur();
          }}
          handleChange={input.onChange}
          variant="standard"
          disabled={isDisabled}
          {...rest}
        />
      )}
    </Field>
  );
};

const InputPhone: FC<FieldProps<any, any> & InputProps> = ({ name, onBlur, ...rest }) => {
  const isDisabledFromFieldset = useContext(FieldsetContext);
  const isDisabled = isDisabledFromFieldset || rest.disabled;
  return (
    <Field name={name}>
      {({ input, meta }) => (
        <InputPhoneBase
          name={input.name}
          variant="standard"
          error={!isDisabled && meta.touched && !!meta.error}
          helperText={meta.touched && meta.error ? (meta.error[0] as string) : undefined}
          value={input.value}
          onChange={input.onChange}
          handleBlur={() => {
            onBlur?.();
            input.onBlur();
          }}
          {...rest}
          placeholder="Телефон"
        />
      )}
    </Field>
  );
};

export const InputKeyboardTime: FC<FieldProps<any, any>> = ({ name, disabled, ...props }) => {
  const isDisabledFromFieldset = useContext(FieldsetContext);
  const isDisabled = isDisabledFromFieldset || disabled;

  return (
    <Field name={name}>
      {({ input, meta }) => (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
          {/*// @ts-ignore next-line*/}
          <KeyboardTimePicker
            ampm={false}
            minutesStep={15}
            okLabel="Выбрать"
            clearLabel="Очистить"
            cancelLabel="Отменить"
            disablePast
            // @ts-ignore next-line
            format="HH:mm"
            error={!isDisabled && meta.touched && !!meta.error}
            helperText={meta.touched && meta.error ? (meta.error[0] as string) : undefined}
            name={input.name}
            value={input.value}
            onChange={input.onChange}
            variant="dialog"
            disabled={isDisabled}
            {...props}
          />
        </MuiPickersUtilsProvider>
      )}
    </Field>
  );
};

export const InputKeyboardDate: FC<FieldProps<any, any>> = ({ name, disabled, ...props }) => {
  const isDisabledFromFieldset = useContext(FieldsetContext);
  const isDisabled = isDisabledFromFieldset || disabled;

  return (
    <Field name={name}>
      {({ input, meta }) => (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
          {/*// @ts-ignore next-line*/}
          <KeyboardDatePicker
            okLabel="Выбрать"
            clearLabel="Очистить"
            cancelLabel="Отменить"
            disablePast
            // @ts-ignore next-line
            format="dd/MM/yyyy"
            error={!isDisabled && meta.touched && !!meta.error}
            helperText={meta.touched && meta.error ? (meta.error[0] as string) : undefined}
            name={input.name}
            value={input.value}
            onChange={input.onChange}
            variant="dialog"
            disabled={isDisabled}
            {...props}
          />
        </MuiPickersUtilsProvider>
      )}
    </Field>
  );
};

const InputDateTime: FC<FieldProps<any, any>> = ({ name, disabled, ...props }) => {
  const isDisabledFromFieldset = useContext(FieldsetContext);
  const isDisabled = isDisabledFromFieldset || disabled;

  return (
    <Field name={name}>
      {({ input, meta }) => (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
          {/*// @ts-ignore next-line*/}
          <KeyboardDateTimePicker
            ampm={false}
            disablePast
            minutesStep={15}
            // @ts-ignore next-line
            format="yyyy/MM/dd HH:mm"
            error={!isDisabled && meta.touched && !!meta.error}
            helperText={meta.touched && meta.error ? (meta.error[0] as string) : undefined}
            name={input.name}
            value={input.value}
            onChange={input.onChange}
            variant="dialog"
            disabled={isDisabled}
            {...props}
          />
        </MuiPickersUtilsProvider>
      )}
    </Field>
  );
};

const InputDate: FC<FieldProps<any, any> & InputProps> = ({ name, onBlur, ...rest }) => {
  const isDisabledFromFieldset = useContext(FieldsetContext);
  const isDisabled = isDisabledFromFieldset || rest.disabled;

  return (
    <Field name={name} {...rest}>
      {({ input, meta }) => (
        <BaseInput
          error={!isDisabled && meta.touched && !!meta.error}
          helperText={meta.touched && meta.error ? (meta.error[0] as string) : undefined}
          name={input.name}
          value={input.value}
          handleBlur={() => {
            onBlur?.();
            input.onBlur();
          }}
          handleChange={input.onChange}
          variant="standard"
          disabled={isDisabled}
          mask="##.##.####"
          endAdornment={<IconCalendar />}
          useFormattedValue
          {...rest}
        />
      )}
    </Field>
  );
};

const InputVehicleVin: FC<FieldProps<any, any> & Omit<InputProps, 'placeholder'>> = ({ name, onBlur, ...rest }) => {
  const isDisabledFromFieldset = useContext(FieldsetContext);
  const isDisabled = isDisabledFromFieldset || rest.disabled;

  return (
    <Field name={name} {...rest}>
      {({ input, meta }) => (
        <InputVehicleVIN
          error={!isDisabled && meta.touched && !!meta.error}
          helperText={meta.touched && meta.error ? (meta.error[0] as string) : undefined}
          name={input.name}
          value={input.value}
          onBlur={() => {
            onBlur?.();
            input.onBlur();
          }}
          onChange={input.onChange}
          variant="standard"
          disabled={isDisabled}
          {...rest}
        />
      )}
    </Field>
  );
};

const InputVehicleNumber: FC<FieldProps<any, any> & Omit<InputProps, 'placeholder'>> = ({ name, onBlur, ...rest }) => {
  const isDisabledFromFieldset = useContext(FieldsetContext);
  const isDisabled = isDisabledFromFieldset || rest.disabled;

  return (
    <Field name={name} {...rest}>
      {({ input, meta }) => (
        <InputVehicleN
          error={!isDisabled && meta.touched && !!meta.error}
          helperText={meta.touched && meta.error ? (meta.error[0] as string) : undefined}
          name={input.name}
          value={input.value}
          onBlur={() => {
            onBlur?.();
            input.onBlur();
          }}
          onChange={input.onChange}
          variant="standard"
          disabled={isDisabled}
          {...rest}
        />
      )}
    </Field>
  );
};

const InputMasked: FC<FieldProps<string, any, HTMLInputElement> & Omit<MaskedInputProps, 'placeholder'>> = ({
  name,
  mask,
  onBlur,
  format,
  parse,
  ...rest
}) => {
  const isDisabledFromFieldset = useContext(FieldsetContext);
  const isDisabled = isDisabledFromFieldset || rest.disabled;

  return (
    <Field name={name} format={format} parse={parse} {...rest}>
      {({ input, meta }) => {
        return (
          <MaskedInput
            error={!isDisabled && meta.touched && !!meta.error}
            helperText={meta.touched && meta.error ? (meta.error[0] as string) : undefined}
            name={input.name}
            value={input.value}
            onBlur={() => {
              onBlur?.();
              input.onBlur();
            }}
            onChange={input.onChange}
            variant="standard"
            disabled={isDisabled}
            mask={mask}
            {...rest}
          />
        );
      }}
    </Field>
  );
};

export default Input;
export {
  InputPrice,
  InputPhone,
  InputNumber,
  InputDate,
  InputVehicleVin,
  InputVehicleNumber,
  InputDateTime,
  InputMasked,
};
