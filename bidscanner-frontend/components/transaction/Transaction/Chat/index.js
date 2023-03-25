import styled from 'styled-components';
import { Box, Flex } from 'grid-styled';
import { Field } from 'redux-form';

import Message from 'components/transaction/Transaction/Chat/Message';
import Input from 'components/transaction/Transaction/Chat/Input';

const Chat = styled(Flex)`
  border: 1px solid #e1e1e1;
  border-radius: 4px;
`;

const Messages = styled(Box)`
  height: 700px;
  overflow: auto;
`;

export default ({ userId, messages }) => (
  <Chat px={2} py={1} w={[1, 1, 1 / 2]} direction="column">
    <Messages>
      {messages.map(message => {
        const displayRight = message.sender.id === userId;
        return (
          <Flex w={1} key={message.id} justify={displayRight && 'flex-end'}>
            <Message {...message} userId={userId} displayRight={displayRight} />
          </Flex>
        );
      })}
    </Messages>
    <Field name="files" component={Input} infoText="Info about files field" />
  </Chat>
);
