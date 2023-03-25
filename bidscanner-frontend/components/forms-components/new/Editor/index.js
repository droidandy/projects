// @flow
import React from 'react';
import styled from 'styled-components';
import { Flex } from 'grid-styled';

import StyledFroala from './StyledFroala';
import InfoIcon from '../InfoIcon';

const Container = styled.div`
  position: relative;
  width: 100%;
  min-height: 180px;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
`;

type EditorProps = {
  placeholder: string,
  infoText?: string,
  input: {
    // TODO: eslint doesn't provide support for nested values
    // value: {
    //   calendarOpen: boolean,
    //   day: Date
    // }
  },
};

const Error = styled.span`
  color: #ff2929;
  font-size: 12px;
`;

export default ({ infoText, placeholder, input, onChange, meta: { touched, error } }: EditorProps) => (
  <Flex w={'100%'} align="center" direction="column">
    <Container>
      {infoText && <InfoIcon text={infoText} />}
      <StyledFroala
        config={{
          height: 140,
          placeholderText: placeholder,
          toolbarBottom: true,
          charCounterMax: 1000,
          toolbarButtons: ['bold', 'italic', 'underline', '|', 'formatUL', 'formatOL'],
          toolbarButtonsMD: null,
          toolbarButtonsSM: null,
          toolbarButtonsXS: null,
        }}
        model={input.value}
        onModelChange={v => {
          input.onChange(v);
          if (onChange) {
            onChange(v);
          }
        }}
        // onModelChange={input.onChange}
      />
    </Container>
    {touched && (error && <Error>{error}</Error>)}
  </Flex>
);
