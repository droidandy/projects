import styled from 'styled-components';

export default styled.span`
  & > a:hover {
    text-decoration: none;
    cursor: pointer;
  }
  & > a {
    color: ${props => (props.color ? props.color : 'black')};
    font-weight: ${props => (props.bold ? 'bold' : 'normal')};
    margin-left: ${props => props.ml};
    margin-left: ${props => props.mr};
    text-decoration: none;
  }
`;
