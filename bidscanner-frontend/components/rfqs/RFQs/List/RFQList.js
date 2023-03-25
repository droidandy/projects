import styled from 'styled-components';
import { Flex, Box } from 'grid-styled';

const RFQName = styled(Box)`
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

const Confidential = styled(Box)`
  font-size: 14px;
`;

const Estimate = styled(Box)`
  font-size: 14px;
`;

const Button = styled.button`
  font-size: 14px;
  border-radius: 2px;
  border: 1px solid #bcbec0;
  background-color: white;
  cursor: pointer;
  margin-right: 5px;
`;

const Wrapper = styled(Flex)`
  border-bottom: 1px solid #E1E1E1;
`;

const RFQ = ({ message, posted, isAd, product, isPublic, isEstimate }) =>
  <Wrapper mt={2} pb={2} wrap justify="space-between">
    <Flex w={[1, 'auto']} mt={[1, 0]}>
      <Flex justify="space-between" direction="column">
        <Flex align="center" wrap>
          {isAd && <Ad mr={1}>AD</Ad>}
          <RFQName>
            {product}
          </RFQName>
        </Flex>
        <Message>
          {message}
        </Message>
        <Posted>
          Posted {posted}
        </Posted>
      </Flex>
    </Flex>
    <Box w={[1, 'auto']} mt={[1, 0]}>
      <Confidential>
        {isPublic ? 'Public' : 'Confidential'}
      </Confidential>
      <Estimate>
        {isEstimate ? 'Estimate' : 'Firm Purchase'}
      </Estimate>
    </Box>
    <Box w={[1, 'auto']} mt={[1, 0]}>
      <Button>edit</Button>
      <Button>delete</Button>
    </Box>
  </Wrapper>;

const create = () => {
  const elm = {
    username: 'Dave Cone',
    country: 'India',
    product: 'Steel Pipes Best pipes, API 5L',
    message: 'Best pipes, minimum order 10k.',
    company: 'Savoy Piping',
    posted: 'May 1, 2017',
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

const rfqs = create();

export default () =>
  <div>
    {rfqs.map(rfq => <RFQ key={rfq.id} {...rfq} />)}
  </div>;
