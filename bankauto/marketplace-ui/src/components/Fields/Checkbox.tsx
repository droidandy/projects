import React, { FC } from 'react';
import { Field, useForm } from 'react-final-form';
import { Box, FormHelperText } from '@material-ui/core';
import CheckboxBase, { CheckboxProps as CheckboxBaseProps } from '@marketplace/ui-kit/components/Checkbox';
import { ComponentProps } from 'types/ComponentProps';
import { useStyles } from './Checkbox.styles';

type CheckboxProps = Omit<CheckboxBaseProps, 'name'> & Required<Pick<CheckboxBaseProps, 'name'>>;

const Checkbox = ({ name, ...rest }: CheckboxProps) => {
  return (
    <Field name={name}>
      {({ input, meta }) => (
        <CheckboxBase
          name={input.name}
          checked={input.value}
          onChange={(_, checked) => {
            input.onChange(checked);
          }}
          {...rest}
        />
      )}
    </Field>
  );
};

interface Props extends ComponentProps {
  label: string | JSX.Element;
  name: string;
}

const CheckboxWithErrorMsg: FC<Props> = ({ label, name }) => {
  const s = useStyles();
  const { change: setFieldValue } = useForm();
  return (
    <Field name={name} type="checkbox">
      {({ meta, input }) => (
        <Box className={s.checkboxWrapper}>
          <CheckboxBase {...input} label={label} onChange={(_, value) => setFieldValue(name, value)} />
          {!!meta.touched && !!meta.error && (
            <FormHelperText error className={s.checkboxError}>
              {meta.error[0]}
            </FormHelperText>
          )}
        </Box>
      )}
    </Field>
  );
};

export { CheckboxWithErrorMsg };

export default Checkbox;
