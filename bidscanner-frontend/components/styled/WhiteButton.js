// @flow
import styled from 'styled-components';

const WhiteButton = styled.button`
  padding: 0.25em 1em;
  background-color: white;
  color: black;
  font-weight: bold;
  border: 1px solid ${props => (props.primary ? '#000' : '#bcbec0')};
  border-radius: 2px;
  transition: all .2s ease-in-out;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: black;
    border-color: #000;
    text-decoration: none;
  }
`;

WhiteButton.AsLink = WhiteButton.withComponent('a');

export default WhiteButton;
