import React from 'react';
import { Field, FieldProps, RenderableProps, FieldRenderProps } from 'react-final-form';
import { Typography } from '@marketplace/ui-kit';

type RenderProps<V> = FieldRenderProps<V, HTMLInputElement>;

export const InputHiddenWithHepler = ({
  input: { value, onChange, ...input },
  meta: { error, touched },
}: FieldRenderProps<number, HTMLInputElement>) => (
  <>
    <input type="hidden" value={value} {...input} />
    {error && touched ? (
      <Typography variant="body2" color="error">
        {error}
      </Typography>
    ) : null}
  </>
);

export const FieldHiddenWithHepler = <V extends any>({
  name,
  ...props
}: Omit<FieldProps<V, RenderProps<V>, HTMLInputElement>, keyof RenderableProps<any>>) => (
  <Field name={name} {...props} component={InputHiddenWithHepler} />
);
