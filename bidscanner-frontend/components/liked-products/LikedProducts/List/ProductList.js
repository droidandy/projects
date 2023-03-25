// @flow
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';

import Description from 'components/search/Search/Description';
import Liked from '../../../svg/liked.svg';
import NotLiked from '../../../svg/not-liked.svg';

const ProductName = styled(Box)`
  font-size: 18px;
  font-weight: bold;
`;

const Price = styled(Box)`
  font-size: 18px;
  font-weight: bold;
`;

const Ad = styled(Box)`
  color: #FF2929;
  font-size: 9px;
  border: 1px solid #FF2929;
  padding: 1px 7px;
  height: 16px;
  border-radius: 2px;
`;

const Message = styled(Box)`
  font-size: 14px;
`;

const Posted = styled(Box)`
  font-size: 12px;
  color: #BCBEC0;
`;

const Username = styled.span`
  font-size: 14px;
  font-weight: bold;
`;

const Country = styled.span`font-size: 14px;`;

const CompanyName = styled(Box)`
  font-size: 14px;
  font-weight: bold;
`;

const Button = styled.button`
  font-size: 14px;
  border-radius: 2px;
  border: 1px solid #bcbec0;
  background-color: white;
  cursor: pointer;
`;

const Wrapper = styled(Flex)`
  border-bottom: 1px solid #E1E1E1;
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

const Product = ({ username, country, company, message, posted, isAd, product, price, liked }) =>
  <Wrapper mt={2} pb={2} wrap>
    <Box ml={[2, 0]} w={[1, 1 / 12]} mt={[1, 0]}>
      <Image>
        <img src="/static/66-66.png" alt="product" />
        <Like>
          {liked ? <Liked /> : <NotLiked />}
        </Like>
      </Image>
    </Box>
    <Flex w={[1, 5 / 12]} ml={2} mt={[1, 0]}>
      <Flex justify="space-between" direction="column">
        <Flex align="center" wrap>
          {isAd && <Ad mr={1}>AD</Ad>}
          <ProductName>
            {product}
          </ProductName>
          <Price>
            {price}
          </Price>
        </Flex>
        <Message>
          {message}
        </Message>
        <Posted>
          Posted {posted}
        </Posted>
      </Flex>
    </Flex>
    <Flex ml={2} wrap w={[1, 2 / 12]}>
      <Box>
        <Box>
          <Username>{username},</Username> <Country>{country}</Country>
        </Box>
        <CompanyName>
          @{company}
        </CompanyName>
      </Box>
    </Flex>
    <Flex mt={[1, 0]} ml={[2, 'auto']} w={[1, 'auto']}>
      <Box>
        <Button>send message</Button>
      </Box>
    </Flex>
  </Wrapper>;

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

const products = create();

export default () =>
  <div>
    <Description number={738} entity="Products" />
    {products.map(product => <Product key={product.id} {...product} />)}
  </div>;
