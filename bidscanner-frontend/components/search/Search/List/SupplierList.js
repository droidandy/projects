import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';

import Description from 'components/search/Search/Description';
import DecimalRating from 'components/styled/DecimalRating';

import H from 'components/Head';

import Liked from '../../../svg/liked.svg';
import NotLiked from '../../../svg/not-liked.svg';

const Head = () => (
  <H
    title="Search Industrial Suppliers"
    description="Search our database of sellers of industrial products and services and find the best supplier to save cost with your project and material purchases"
    keywords="supplier database, vendor list, seller list, search supplier, best supplier, save cost"
  />
);

const SupplierName = styled(Box)`
  font-size: 18px;
  font-weight: bold;
`;

const Posted = styled(Box)`
  font-size: 12px;
  color: #bcbec0;
`;

const Country = styled.span`font-size: 14px;`;

const CompanyName = styled.span`
  font-size: 14px;
  font-weight: bold;
`;

const Button = styled.button`
  font-size: 14px;
  border-radius: 2px;
  border: 1px solid #bcbec0;
  background-color: white;
  cursor: pointer;
  margin-right: 10px;
`;

const Wrapper = styled(Flex)`border-bottom: 1px solid #e1e1e1;`;

const Smth = styled(Flex)`line-height: 95%;`;

const Tag = styled.span`
  font-size: 14px;
  margin-right: 5px;
`;

const Like = styled.div`
  position: absolute;
  top: -12px;
  right: -12px;
  background-color: white;
  border-radius: 50%;
  height: 28px;
  width: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Image = styled.div`
  height: 66px;
  width: 66px;
  position: relative;
`;

const Supplier = ({ username, country, company, posted, tags, liked, rating }) => (
  <Wrapper mt={2} pb={2} wrap>
    <Box ml={[2, 0]} mt={[1, 0]}>
      <Image>
        <img src="/static/66-66.png" alt="supplier" />
        <Like>{liked ? <Liked /> : <NotLiked />}</Like>
      </Image>
    </Box>
    <Flex mt={[1, 0]} ml={2}>
      <Smth justify="space-between" direction="column">
        <Flex align="center">
          <SupplierName>{username}</SupplierName>
          <Box ml={1}>
            <DecimalRating rating={rating} />
          </Box>
        </Flex>
        <Box>
          <CompanyName>@{company},</CompanyName> <Country>{country}</Country>
        </Box>
        <Flex wrap>{tags.map(tag => <Tag key={tag}>#{tag}</Tag>)}</Flex>
        <Posted>Posted {posted}</Posted>
      </Smth>
    </Flex>
    <Flex mt={1} ml={[2, 'auto']} wrap align="flex-start">
      <Button>send message</Button>
      <Button>follow</Button>
    </Flex>
  </Wrapper>
);

const create = () => {
  const elm = {
    username: 'Dave Cone',
    country: 'India',
    product: 'Steel Pipes Best pipes, API 5L',
    message: 'Best pipes, minimum order 10k.',
    company: 'Savoy Piping',
    posted: 'May 1, 2017',
    price: '$7499/tonn',
    isAd: true,
    tags: ['steel pipe', 'discount', 'seamless', 'API 5L', 'test'],
    rating: 90,
  };

  const elms = [];
  for (let i = 0; i < 8; i += 1) {
    elms.push({
      id: i,
      ...elm,
    });
  }

  return elms;
};

const suppliers = create();

export default () => (
  <div>
    <Head />
    <Description number={738} entity="Suppliers" />
    {suppliers.map(supplier => <Supplier key={supplier.id} {...supplier} />)}
  </div>
);
