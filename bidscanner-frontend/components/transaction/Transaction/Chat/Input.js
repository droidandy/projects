import styled from 'styled-components';
import { Box, Flex } from 'grid-styled';
import { Field } from 'redux-form';

import Clip from './Dropzone/Clip';
import FileList from './Dropzone/FileList';

const Input = styled.input`
  border-radius: 4px;
  border: 1px solid #e1e1e1;
  width: 100%;
  font-size: 14px;
  padding: 0px 5px;
`;

const Button = styled.button`
  border: 1px solid #bcbec0;
  background-color: white;
  color: black;
  font-size: 14px;
  border-radius: 4px;
`;

const InputForField = props => <Input type={props.type} placeholder={props.placeholder} {...props.input} />;

export default () => (
  <Box>
    <Flex>
      <Field name="message-files" component={Clip} />
      <Box w={1} ml={2}>
        <Field name="content" component={InputForField} />
      </Box>
      <Box ml={1}>
        <Button>send</Button>
      </Box>
    </Flex>
    <Box mt={1}>
      <Field name="message-files" component={FileList} />
    </Box>
  </Box>
);
