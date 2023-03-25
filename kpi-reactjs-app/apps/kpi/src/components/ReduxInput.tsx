import React, { useContext } from 'react';
import { FormContext } from 'typeless-form';
import { Input, InputProps } from './FormInput';
import { Trans } from 'react-i18next';
import { useLanguage } from 'src/hooks/useLanguage';

interface ReduxFormControlProps extends InputProps {
  name: string;
  langSuffix?: boolean;
  readOnlyText?: boolean;
}

export const FormInput = (props: ReduxFormControlProps) => {
  const { langSuffix, width, readOnlyText, ...rest } = props;
  const data = useContext(FormContext);
  const lang = useLanguage();
  const name = langSuffix ? `${props.name}_${lang}` : props.name;
  if (!data) {
    throw new Error(`${name} cannot be used without FormContext`);
  }
  const hasError = data.touched[name] && !!data.errors[name];
  const value = data.values[name];
  const inputProps: any = {};
  if (rest.type !== 'file') {
    inputProps.value = value == null ? '' : value;
  }
  if (readOnlyText) {
    return value == null ? '' : value;
  }
  return (
    <Input
      data-error={hasError ? true : undefined}
      error={hasError ? <Trans>{data.errors[name]}</Trans> : null}
      onBlur={() => data.actions.blur(name)}
      onChange={e => {
        data.actions.change(
          name,
          rest.type === 'file' ? e.target.files![0] : e.target.value
        );
      }}
      {...inputProps}
      {...rest}
    />
  );
};
