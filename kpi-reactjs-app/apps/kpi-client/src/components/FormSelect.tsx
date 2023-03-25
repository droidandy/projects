import React, { useContext } from 'react';
import { FormContext } from 'typeless-form';
import { Trans } from 'react-i18next';
import {
  SelectProps,
  Select,
  CreatableSelectProps,
  CreatableSelect,
} from './Select';
import { ErrorMessage } from './ErrorMessage';
import styled from 'styled-components';

interface BaseFormSelectProps {
  name: string;
  readOnlyText?: boolean;
  noMenuPortal?: boolean;
  customValue?: any;
  customOnChange?: (option: any) => void;
}

interface FormSelectProps<OptionType>
  extends SelectProps<OptionType>,
    BaseFormSelectProps {
  name: string;
}

interface CreatableFormSelectProps<OptionType>
  extends CreatableSelectProps<OptionType>,
    BaseFormSelectProps {
  name: string;
}

const Wrapper = styled.div`
  width: 100%;
  & > div:first-child {
    width: 100%;
  }
`;

function BaseSelect(
  props: BaseFormSelectProps & { Component: React.SFC<SelectProps<any>> }
) {
  const {
    name,
    readOnlyText,
    Component,
    noMenuPortal,
    customValue,
    customOnChange,
    ...rest
  } = props;
  const data = useContext(FormContext);
  if (!data) {
    throw new Error(`${name} cannot be used without FormContext`);
  }
  const hasError = data.touched[name] && !!data.errors[name];
  const value = data.values[name];
  if (readOnlyText) {
    if (Array.isArray(value)) {
      return (
        <div>
          {value.map((item, i) => (
            <div key={i}>{item.label}</div>
          ))}
        </div>
      );
    }
    return value ? value.label : null;
  }
  return (
    <Wrapper data-error={hasError ? true : undefined}>
      <Component
        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
        menuPortalTarget={noMenuPortal ? undefined : document.body}
        value={
          customValue !== undefined ? customValue : value == null ? null : value
        }
        onBlur={() => data.actions.blur(name)}
        onChange={option => {
          if (customOnChange) {
            customOnChange(option);
          } else {
            data.actions.change(name, option);
          }
        }}
        {...rest}
      />

      {hasError && (
        <ErrorMessage>
          <Trans>{data.errors[name]}</Trans>
        </ErrorMessage>
      )}
    </Wrapper>
  );
}

export function FormSelect<OptionType>(props: FormSelectProps<OptionType>) {
  return <BaseSelect {...props} Component={Select} />;
}

export function CreatableFormSelect<OptionType>(
  props: CreatableFormSelectProps<OptionType>
) {
  return <BaseSelect {...props} Component={CreatableSelect} />;
}
