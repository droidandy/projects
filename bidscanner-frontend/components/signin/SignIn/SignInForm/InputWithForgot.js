// @flow
import styled from 'styled-components';
import type { MetaProps, InputProps } from 'redux-form';
import { Box } from 'grid-styled';
import Router from 'next/router';

import Input from 'components/styled/Input';

type PropsFromField = {
  type: string,
  placeholder?: string,
  meta: MetaProps,
  input: InputProps,
};

const ErrorText = styled.div`
  font-size: 14px;
  color: red;
`;

const Forgot = styled.div`
  position: absolute;
  right: 10px;
  color: black;
  top: 7px;
  font-size: 14px;
  cursor: pointer;
`;

const Wrapper = styled.div`position: relative;`;

export default (field: PropsFromField) =>
  <Wrapper>
    <Input type={field.type} placeholder={field.placeholder} {...field.input} />
    <Forgot onClick={() => Router.push('/password/request', '/requestnewpassword')}>Forgot?</Forgot>
    <Box>
      {field.meta &&
        field.meta.touched &&
        field.meta.error &&
        <ErrorText>
          {field.meta.error}
        </ErrorText>}
    </Box>
  </Wrapper>;
