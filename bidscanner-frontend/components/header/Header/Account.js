import styled from 'styled-components';
import { Flex } from 'grid-styled';

const Greetings = styled.span`
  font-size: 15px;
  margin-left: 5px;
  @media (max-width: 350px) {
    display: none;
  }
`;

export default ({ firstName, imgSrc }) => (
  <Flex mt={[1, 0]}>
    <img src={imgSrc} alt={firstName} />
    <Greetings>
      hi, <b>{firstName}</b>
    </Greetings>
  </Flex>
);
