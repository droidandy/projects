import React from 'react';
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';

import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';

import HourGlass from '../../../svg/hourglass.svg';
import Dollar from '../../../svg/dollar.svg';

const Post = styled(Box)`
  border: 1px solid #e1e1e1;
  border-radius: 4px;
`;

// header

const Header = styled(Flex)``;

const Posted = styled.div`
  color: grey;
  font-size: 12px;
  line-height: 99%;
`;

const AboutUser = styled(Box)`
  line-height: 99%;
`;

const Username = styled.span`font-size: 14px;`;

const CompanyName = styled.span`
  font-size: 12px;
  margin-left: 5px;
`;

const Country = styled.span`
  font-size: 12px;
  margin-left: 5px;
`;

// description

const Description = styled(Box)`
`;

const Title = styled.div`font-size: 14px;`;

const PurchaseType = styled(Flex)`
  font-size: 12px;
  color: #AEB0B3;
`;

const Closes = styled(Flex)`
  font-size: 12px;
  color: #AEB0B3;
`;

const Tag = styled.div`
  font-size: 14px;
  margin-right: 5px;
`;

const About = styled(Box)`
  font-size: 14px;
`;

const Action = styled.button`
  font-size: 14px;
  border-radius: 2px;
  border: 1px solid #bcbec0;
  background-color: white;
  margin-right: ${props => (props.mr ? props.mr : '0px')};

  cursor: pointer;
  &:focus {
    outline: none;
  }
`;

const Hr = styled.div`border-bottom: 1px solid #e1e1e1;`;

export default ({
  firstName,
  lastName,
  posted,
  companyName,
  country,
  avatarSrc,
  rfqName,
  closes,
  descriptionText,
  tags,
  estimate,
}) =>
  <Post w={[1, 1, 520]} py={2} mt={2}>
    <Header mx={2}>
      <img src={avatarSrc} alt={`rfq by ${firstName} ${lastName}`} />
      <Box ml={1} h={26}>
        <AboutUser>
          <Username>
            {firstName} {lastName},
          </Username>
          <CompanyName>
            @{companyName},
          </CompanyName>
          <Country>
            {country}
          </Country>
        </AboutUser>
        <Posted>
          Posted {distanceInWordsToNow(posted)} Ago
        </Posted>
      </Box>
    </Header>
    <Description mt={1} mx={2}>
      <Title>
        {rfqName}
      </Title>
      <Flex mt={1}>
        <PurchaseType align="center">
          <Dollar />
          <Box ml={5}>
            {estimate ? 'Estimate' : 'Firm Purchase'}
          </Box>
        </PurchaseType>
        <Closes ml={2} align="center">
          <HourGlass />
          <Box ml={5}>
            Closes in {distanceInWordsToNow(closes)}
          </Box>
        </Closes>
      </Flex>
      <Box my={1}>
        <Hr />
      </Box>
      <Flex wrap>
        {tags.map((tag, index) =>
          <Tag key={`tag-${index}`}>
            #{tag}
          </Tag>
        )}
      </Flex>
      <About mt={1}>
        {descriptionText}
      </About>
    </Description>
    <Box mt={2} mx={2}>
      <Action mr="10px">see RFQ</Action>
      <Action>send message</Action>
    </Box>
  </Post>;
