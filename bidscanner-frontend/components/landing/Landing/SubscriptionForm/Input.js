// @flow
import styled from 'styled-components';
import type { MetaProps, InputProps } from 'redux-form';
import { Box } from 'grid-styled';
import Input from 'components/styled/Input';

type PropsFromField = {
  type: string,
  placeholder?: string,
  meta: MetaProps,
  input: InputProps,
};

const StyledInput = styled(Input)`min-width: 500px;`;

const ErrorText = styled.div`
  font-size: 14px;
  color: red;
`;

export default (field: PropsFromField) => (
  <div>
    <StyledInput type={field.type} placeholder={field.placeholder} {...field.input} />
    <Box>
      {field.meta && field.meta.touched && field.meta.error && <ErrorText>{field.meta.error}</ErrorText>}
    </Box>
  </div>
);
