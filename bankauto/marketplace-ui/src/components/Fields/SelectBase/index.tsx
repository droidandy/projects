import React from 'react';
import { Field } from 'react-final-form';
import { FormControlBlock } from 'components/FormControlBlock';
import BaseSelect, { Props as BaseSelectProps, SelectOption } from 'components/Select/Select';

export interface SelectBaseProps extends Omit<BaseSelectProps, 'options' | 'value' | 'onBlur' | 'onChange'> {
  name: string;
  options?: SelectOption[];
  show?: boolean;
  useScroll?: boolean;
}

export const SelectBase = ({ name, options, show, useScroll, disabled, ...rest }: SelectBaseProps) => (
  <Field name={name} type="select">
    {({ input, meta }) => {
      const variants: SelectOption[] = options || meta.data?.options || [];
      const isDisabled = typeof disabled !== 'undefined' ? disabled : !variants.length;
      return (
        <FormControlBlock show={show || !!variants.length} useScroll={useScroll} register>
          <BaseSelect
            {...rest}
            error={meta.touched && !!meta.error}
            name={input.name}
            value={input.value}
            onBlur={input.onBlur}
            onChange={input.onChange}
            options={variants}
            disabled={isDisabled}
          />
        </FormControlBlock>
      );
    }}
  </Field>
);
