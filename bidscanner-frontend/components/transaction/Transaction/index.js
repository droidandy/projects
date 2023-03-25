import React from 'react';
import { Box, Flex } from 'grid-styled';
import MutedText from 'components/styled/MutedText';

import Layout from 'components/Layout';
import Container from 'components/styled/Container';

import StatusBar from 'components/transaction/Transaction/StatusBar';
import UserCard from 'components/transaction/Transaction/UserCard';
import Chat from 'components/transaction/Transaction/Chat';

import FormContainer from 'containers/transaction/Transaction/FormContainer';

export default ({ username, country, company, rating, messages, userId }) => (
  <Layout title="Create PO" showSearch>
    <Container>
      <Box mt={1}>
        <MutedText.Button>{'< back to Messages'}</MutedText.Button>
      </Box>
      <StatusBar />
      <UserCard username={username} country={country} company={company} rating={rating} />
      <Flex mt={3} w={1} wrap>
        <Box w={[1, 1, 1 / 2]}>
          <FormContainer />
        </Box>
        <Chat messages={messages} userId={userId} />
      </Flex>
    </Container>
  </Layout>
);
