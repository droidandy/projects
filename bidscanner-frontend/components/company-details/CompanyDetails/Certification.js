// @flow
import styled from 'styled-components';
import { Box, Flex } from 'grid-styled';

import ValidCertificate from '../../svg/valid-certificate.svg';
import NotValidCertificate from '../../svg/not-valid-certificate.svg';

export type CertificationProps = {
  name: string,
  expired: boolean,
};

const Name = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const Expired = styled.div`
  color: red;
  font-size: 8px;
`;

export default ({ name, expired }: CertificationProps) =>
  <Flex mt={1}>
    {expired ? <NotValidCertificate /> : <ValidCertificate />}
    <Box ml={1}>
      <Name>
        {name}
      </Name>
      {expired && <Expired>Expired</Expired>}
    </Box>
  </Flex>;
