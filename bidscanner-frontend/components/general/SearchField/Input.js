// @flow
import React from 'react';
import TextField from 'material-ui/TextField';
import type { MetaProps, InputProps } from 'redux-form';

type PropsFromField = {
  type: string,
  placeholder?: string,
  meta: MetaProps,
  input: InputProps,
  onFocus: Function,
};

const moveCaretAtEnd = e => {
  const value = e.target.value;
  e.target.value = '';
  e.target.value = value;
};

export default (field: PropsFromField) =>
  <TextField
    {...field.input}
    fullWidth
    floatingLabelText="What are you looking for?"
    underlineFocusStyle={{
      borderColor: '#E0E0E0',
      borderWidth: '1px',
    }}
    errorText={field.meta && field.meta.touched && field.meta.error}
    inputStyle={{
      fontSize: '26px',
      fontWeight: 'bold',
      paddingBottom: '5px',
    }}
    ref={input => input && field.autofocus && input.focus()}
    onFocus={moveCaretAtEnd}
  />;
