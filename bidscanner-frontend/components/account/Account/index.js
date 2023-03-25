// @flow
import React from 'react';
import styled from 'styled-components';

import config from 'context/config';

import { Flex, Box } from 'grid-styled';
import { get } from 'lodash';

import FormContainer from 'containers/account/Account/FormContainer';
import WhiteButton from 'components/styled/WhiteButton';

import Avatar from 'components/general/Avatar';
import Options from './Options';

const Container = styled.div`max-width: 450px;`;

const PhotoCol = styled.div`
  width: 100px;
  margin-right: 32px;
`;

const NameCol = styled.div`
  flex: 1 1 auto;
  padding-top: 12px;
`;

const NameRow = styled.div`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.7em;
  font-weight: bold;
`;

const IconCol = styled.div`
  width: 30px;
  margin-left: 32px;
  margin-top: 16px;
`;

export default ({ me: { loading, me } }) => {
  const bucketKey = get(me, 'profile_photo.images[0].bucket_key');
  return (
    <Container>
      <Flex>
        <PhotoCol>
          {!loading && !bucketKey && <Avatar firstName={me.first_name} lastName={me.last_name} />}
          {!loading &&
          bucketKey && (
            <img
              src={`${config.API_URL}/${bucketKey}`}
              alt={!loading ? `${me.first_name} ${me.last_name}` : 'Your Name'}
            />
          )}
        </PhotoCol>
        <NameCol>
          <NameRow>{!loading && `${me.first_name} ${me.last_name}`}</NameRow>
          {/* TODO: change the href in the future */}
          <WhiteButton.AsLink href="/">view my public page</WhiteButton.AsLink>
        </NameCol>
        <IconCol>
          <Options />
        </IconCol>
      </Flex>
      <Box mt={4}>
        <FormContainer />
      </Box>
    </Container>
  );
};
