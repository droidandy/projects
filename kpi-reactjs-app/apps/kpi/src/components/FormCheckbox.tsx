import React, { useContext } from 'react';
import { FormContext } from 'typeless-form';
import { Checkbox } from './Checkbox';
import { useTranslation } from 'react-i18next';

interface FormCheckboxProps {
  name: string;
  children: React.ReactNode;
  noMargin?: boolean;
  readOnlyText?: boolean;
  style?: React.CSSProperties;
}

export const FormCheckbox = (props: FormCheckboxProps) => {
  const { name, readOnlyText, ...rest } = props;
  const data = useContext(FormContext);
  const { t } = useTranslation();
  if (!data) {
    throw new Error(`${name} cannot be used without FormContext`);
  }
  const value = data.values[name];
  if (readOnlyText) {
    return <>{value ? t('Yes') : t('No')}</>;
  }
  return (
    <Checkbox
      checked={!!value}
      onChange={() => {
        data.actions.change(name, !value);
      }}
      {...rest}
    />
  );
};
