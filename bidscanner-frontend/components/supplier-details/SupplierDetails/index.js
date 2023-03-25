// @flow
import React from 'react';
import { Flex, Box } from 'grid-styled';
import Container from 'components/styled/Container';
import NavigateBefore from 'material-ui/svg-icons/image/navigate-before';
import Layout from 'components/Layout';
import styled from 'styled-components';
import { Colors } from 'context/colors';
import Info, { type InfoProps } from 'components/supplier-details/SupplierDetails/Info';
import SmallText from 'components/styled/SmallText';
import Header, { type HeaderProps } from 'components/supplier-details/SupplierDetails/Header';
import Products, { ProductsProps } from 'components/supplier-details/SupplierDetails/Products';
import CommentList from 'components/general/CommentList';
import type { CommentListProps } from 'components/general/CommentList';

const GrayText = SmallText.extend`color: ${Colors.lightGray};`;

const BlueText = styled.span`
  color: ${Colors.blue};
  font-size: 1em;
  cursor: pointer;
`;

const Navigation = styled(Flex)`
  color: #bcbec0;
  font-size: 14px;
  cursor: pointer;
`;

type SupplierDetailsProps = CommentListProps & InfoProps & HeaderProps & ProductsProps;

export default ({
  name,
  comments,
  loggedIn,
  image,
  rating,
  company,
  follows,
  followers,
  country,
  buys,
  sells,
  products,
}: SupplierDetailsProps) => (
  <Layout title="Company" showSearch>
    <Container>
      <Navigation mt={1} align="center">
        <NavigateBefore style={{ color: '#BCBEC0', height: '12px', width: '12px' }} />Back To Search Result
      </Navigation>
      <Flex direction="column" mt={1}>
        <Header profileImage={image} backgroundImage={image} />
        <Flex>
          <Box width={[0, 0, 0, 1 / 4]} />
          <Box p={1} width={[1, 1, 1, 0.4]}>
            <Info
              name={name}
              company={company}
              country={country}
              follows={follows}
              followers={followers}
              rating={rating}
              buys={buys}
              sells={sells}
            />
            <hr />
            <GrayText>what people say about {name}:</GrayText>
            <CommentList loggedIn={loggedIn} comments={comments} />
            <BlueText>see more...</BlueText>
          </Box>
        </Flex>
        <Flex>
          <Box width={[0, 0, 0, 1 / 4]} />
          <Box p={1} width={[1, 1, 1, 0.7]}>
            <Products products={products} />
          </Box>
        </Flex>
      </Flex>
    </Container>
  </Layout>
);
