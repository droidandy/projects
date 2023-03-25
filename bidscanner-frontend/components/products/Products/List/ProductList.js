// @flow
import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';

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
  color: #ff2929;
  font-size: 9px;
  border: 1px solid #ff2929;
  padding: 1px 7px;
  height: 16px;
  border-radius: 2px;
`;

const Message = styled(Box)`font-size: 14px;`;

const Posted = styled(Box)`
  font-size: 12px;
  color: #bcbec0;
`;

const Button = styled.button`
  font-size: 14px;
  border-radius: 2px;
  border: 1px solid #bcbec0;
  background-color: white;
  cursor: pointer;
  margin-right: 5px;
`;

const Wrapper = styled(Flex)`border-bottom: 1px solid #e1e1e1;`;

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

const Product = ({ message, posted, isAd, product, price, liked }) => (
  <Wrapper mt={2} pb={2} wrap>
    <Box ml={[2, 0]} w={[1, 1 / 12]} mt={[1, 0]}>
      <Image>
        <img src="/static/66-66.png" alt="product" />
        <Like>{liked ? <Liked /> : <NotLiked />}</Like>
      </Image>
    </Box>
    <Flex w={[1, 7 / 12]} ml={[2, 2, 2, 1]} mt={[1, 0]}>
      <Flex justify="space-between" direction="column">
        <Flex align="center" wrap>
          {isAd && <Ad mr={1}>AD</Ad>}
          <ProductName>{product}-</ProductName>
          <Price>{price}</Price>
        </Flex>
        <Message>{message}</Message>
        <Posted>Posted {posted}</Posted>
      </Flex>
    </Flex>
    <Box w={[1, 'auto']} ml={[2, 'auto']} mt={[1, 0]}>
      <Button>edit</Button>
      <Button>delete</Button>
    </Box>
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

export default () => <div>{products.map(product => <Product key={product.id} {...product} />)}</div>;
