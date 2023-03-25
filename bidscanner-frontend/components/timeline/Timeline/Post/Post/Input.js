import styled from 'styled-components';
import { Box } from 'grid-styled';

const Input = styled.input`
  border-radius: 4px;
  height: 26px;
  width: 100%;
  border: 1px solid #e1e1e1;
  font-size: 14px;
  padding: 0px 5px;

  &:focus {
    outline: none;
  }

  ::placeholder {
    font-size: 12px;
  }
`;

const ErrorText = styled.div`
  font-size: 14px;
  color: red;
`;

export default field =>
  <div>
    <Input type={field.type} placeholder={field.placeholder} {...field.input} />
    <Box>
      {field.meta &&
        field.meta.touched &&
        field.meta.error &&
        <ErrorText>
          {field.meta.error}
        </ErrorText>}
    </Box>
  </div>;
