import styled from 'styled-components';

const Heading = styled.h1`
  font-size: ${props => props.size || '1.5rem'};
  text-align: ${props => props.align || 'center'};
  font-weight: ${props => (props.bold ? 'bold' : 'normal')};
`;

export default Heading;
