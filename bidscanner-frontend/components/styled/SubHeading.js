import styled from 'styled-components';

const Heading = styled.h1`
  font-size: ${props => props.size || '0.9rem'};
  text-align: center;
`;

export default Heading;
