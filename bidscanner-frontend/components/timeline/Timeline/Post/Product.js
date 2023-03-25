import React from 'react';
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';

import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';

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

const Title = styled(Box)`
  font-size: 14px;
`;

const Description = styled(Box)`
`;

const About = styled(Box)`
  font-size: 14px;
`;

const Img = styled.img`max-width: 100%;`;

// likes and comments

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

const Tag = styled.div`
  font-size: 14px;
  margin-right: 5px;
`;

export default ({
  firstName,
  lastName,
  posted,
  companyName,
  country,
  imgSrc,
  avatarSrc,
  productName,
  descriptionText,
  tags,
}) =>
  <Post w={[1, 1, 520]} pt={2} mt={2} pb={1}>
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
    <Title mx={2} mt={1}>
      {productName}
    </Title>
    <Flex mt={1} justify="center">
      <Img src={imgSrc} alt="post" />
    </Flex>
    <Description mt={1} mx={2}>
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
      <Action mr="10px">see Product</Action>
      <Action>send message</Action>
    </Box>
  </Post>;
