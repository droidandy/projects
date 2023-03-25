// @flow
import React from 'react';
import styled from 'styled-components';
import { compose, withState, withHandlers } from 'recompose';
import config from 'context/config';

import { Flex, Box } from 'grid-styled';
import FormContainer from 'containers/company/Company/FormContainer';
import WhiteButton from 'components/styled/WhiteButton';

import Companies from './Companies';

const Container = styled.div`max-width: 450px;`;

const PhotoCol = styled.div`
  & > img {
    width: 100px;
    height: 100px;
  }
  margin-right: 32px;
`;

const NameCol = styled.div`flex: 1 1 auto;`;

const NameRow = styled.div`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.6em;
  font-weight: bold;
`;

const IconCol = styled.div`
  width: 30px;
  margin-left: 32px;
  margin-top: 4px;
`;

export default compose(
  // set current company as the first company from all companies we belong to
  withState('currentCompany', 'setCurrentCompany', ({ companies }) => companies[0] || null),
  withHandlers({
    changeCurrentCompany: props => company => {
      props.setCurrentCompany(company);
    },
  })
)(({ currentCompany, changeCurrentCompany, companies }) => {
  if (currentCompany && !currentCompany.admin) {
    return <Container>Use the standart view.</Container>;
  }

  return (
    <Container>
      <Flex>
        <PhotoCol>
          {currentCompany && (
            <img
              src={`${config.API_URL}/${currentCompany.logoBucketKey}`}
              alt={currentCompany && currentCompany.name}
            />
          )}
        </PhotoCol>
        <NameCol>
          <NameRow>{currentCompany && currentCompany.name}</NameRow>
          <WhiteButton.AsLink href="#public">view company page</WhiteButton.AsLink>
        </NameCol>
        <IconCol>
          <Companies companies={companies} changeCurrentCompany={changeCurrentCompany} />
        </IconCol>
      </Flex>
      <Box mt={4}>
        <FormContainer companyId={currentCompany && currentCompany.id} />
      </Box>
    </Container>
  );
});
