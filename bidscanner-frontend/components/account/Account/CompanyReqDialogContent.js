// @flow
import React from 'react';
import styled from 'styled-components';

import { Box, Flex } from 'grid-styled';
import BlackButton from 'components/styled/BlackButton';
import MutedText from 'components/styled/MutedText';

import config from 'context/config';
import Avatar from 'components/general/Avatar';

import Error from 'components/styled/SimpleError';

const Container = styled.form`text-align: center;`;

const Title = styled.h2`
  font-weight: bold;
  font-size: 1.75em;
`;

const CompanyName = styled(Box)`text-transform: uppercase;`;
const BusinessType = styled(Box)``;

export default ({
  // redux form controls
  handleSubmit,
  submitting,
  error,

  loading,
  // company data
  companyName,
  businessType,
  companyLogoBucketKey,
  // company owner data
  firstName,
  lastName,
  avatarBucketKey,
}) => (
  <Container onSubmit={handleSubmit}>
    <Title>Join</Title>
    <Box mt={2}>
      {!loading && (
        <img
          style={{ width: '100px', height: '100px' }}
          src={`${config.API_URL}/${companyLogoBucketKey}`}
          alt={companyName || ''}
        />
      )}
    </Box>
    {!loading && (
      <Box mt={1}>
        <CompanyName>{companyName}</CompanyName>
        <BusinessType>{businessType}</BusinessType>
      </Box>
    )}
    <Flex mt={2} justify="center">
      {!loading && !avatarBucketKey && <Avatar firstName={firstName} lastName={lastName} />}
      {!loading &&
      avatarBucketKey && (
        <img
          src={`${config.API_URL}/${avatarBucketKey}`}
          alt={!loading ? `${firstName} ${lastName}` : 'Your Name'}
        />
      )}
    </Flex>
    <Box mt={1}>{!loading && `${firstName} ${lastName}`}</Box>
    <MutedText.Box>Admin</MutedText.Box>
    <Error p={1}>{error}</Error>
    <Box mt={2} mb={1}>
      <BlackButton type="submit" disabled={submitting}>
        Send Request
      </BlackButton>
    </Box>
    <MutedText.Box>
      You must work for this company to join. The Admin of your company has to approve your request.
    </MutedText.Box>
  </Container>
);
