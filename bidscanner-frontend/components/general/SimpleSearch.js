// @flow
import React from 'react';
import TextField from 'material-ui/TextField';
import SearchIcon from 'material-ui/svg-icons/action/search';
import IconButton from 'material-ui/IconButton';
import { Flex } from 'grid-styled';
import type { MetaProps, InputProps } from 'redux-form';
// import styled from 'styled-components';

export type SimpleSearchProps = {
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

export default (field: SimpleSearchProps) =>
  <Flex>
    <TextField
      {...field.input}
      fullWidth
      floatingLabelText={field.placeholder}
      underlineFocusStyle={{
        borderColor: '#E0E0E0',
        borderWidth: '1px',
      }}
      errorText={field.meta && field.meta.touched && field.meta.error}
      inputStyle={{
        fontSize: '1em',
        paddingBottom: '0.5em',
        paddingLeft: '0.5em',
      }}
      ref={input => input && field.autofocus && input.focus()}
      onFocus={moveCaretAtEnd}
    />
    <Flex align="flex-end">
      <IconButton>
        <SearchIcon style={{ width: '30px', height: '30px' }} />
      </IconButton>
    </Flex>
  </Flex>;
