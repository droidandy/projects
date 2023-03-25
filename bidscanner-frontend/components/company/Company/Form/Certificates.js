// @flow
import styled from 'styled-components';
import { Box, Flex } from 'grid-styled';
import isAfter from 'date-fns/is_after';

import ValidCertificate from '../../../svg/valid-certificate.svg';
import NotValidCertificate from '../../../svg/not-valid-certificate.svg';

const Name = styled.div`
  font-size: 16px;
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const Expired = styled.div`
  color: red;
  font-size: 8px;
`;

const Button = styled.button`
  border: 1px solid black;
  padding: 0px 10px;
  background-color: white;
  border-radius: 2px;
  margin-left: 5px;

  :hover {
    cursor: pointer;
    background-color: #e8e8e8;
  }
`;

const Absence = styled(Flex)`
  color: #bcbec0;
  font-size: 0.75em;
`;

const Certificates = ({ certificates }) => {
  if (!certificates || certificates.length === 0) {
    return <Absence justify="center">There is no certificates yet.</Absence>;
  }

  return (
    <Box w={1}>
      {certificates.map(({ expires_at, id, certification: { name } }) => {
        const expired = isAfter(new Date(), expires_at);
        return (
          <Flex w={1} key={`certificate-${id}`} mt={1} wrap>
            {expired ? <NotValidCertificate /> : <ValidCertificate />}
            <Box ml={1} w={1 / 2}>
              <Name w={1}>{name}</Name>
              {expired && <Expired>Expired</Expired>}
            </Box>
            <Box ml="auto">
              <Button type="button">Update</Button>
            </Box>
          </Flex>
        );
      })}
    </Box>
  );
};

export default Certificates;
