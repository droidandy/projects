import styled from 'styled-components';
import { Flex } from 'grid-styled';

import { Link } from 'next-url-prettifier';
import StyledLink from 'components/styled/StyledLink';

import NavigationDropdown from 'components/header/Header/NavigationDropdown';

const Button = styled.button`
  border: none;
  border-radius: 2px;
  background-color: black;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 15px;
  &:active,
  &:focus {
    outline: none;
  }

  height: 26px;
  padding: 0px 10px;
  margin-right: 5px;
  position: relative;
`;

const DealsNotification = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  posiotion: absolute;
  border-radius: 50%;
  background-color: #ff2929;
  position: absolute;
  right: -9px;
  top: -9px;
  font-size: 12px;
`;

const rfqsLinks = [
  { name: 'New RFQ', path: '/rfq/create', as: '/private/rfqs/create-rfq' },
  { name: 'My RFQs', path: '/user/rfqs', as: '/private/rfqs/posted-rfqs' },
  { name: 'Liked RFQs', path: '/user/liked/rfqs', as: '/private/rfqs/liked-rfqs' },
  { name: 'Suggested RFQs', path: '/user/suggested/rfqs', as: '/private/rfqs/matching-rfqs' },
];

const productLinks = [
  { name: 'New Product', path: '/product/create', as: '/private/products/create-product' },
  { name: 'My Products', path: '/user/products', as: '/private/products/posted-products' },
  { name: 'Liked Products', path: '/user/liked/products', as: '/private/products/liked-products' },
  { name: 'Suggested Products', path: '/user/suggested/products', as: '/private/products/matching-products' },
];

export default ({ newDealsNumber }) => (
  <Flex mt={[1, 0]}>
    <NavigationDropdown title="RFQs" links={rfqsLinks} />
    <NavigationDropdown title="products" links={productLinks} />
    <Button>
      <StyledLink color="white">
        <Link href="/user/deals" as="/private/transactions">
          <a>deals</a>
        </Link>
      </StyledLink>
      {newDealsNumber !== 0 && <DealsNotification>{newDealsNumber}</DealsNotification>}
    </Button>
  </Flex>
);
