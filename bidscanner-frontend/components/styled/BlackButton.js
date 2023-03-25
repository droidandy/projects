import styled from 'styled-components';

export default styled.button`
  padding: 0.25em 1.5em;
  background-color: black;
  color: white;
  font-weight: bold;
  font-size: 1.5em;
  border-radius: 4px;
  border: 0 none;
  transition: all .2s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: #333;
  }
`;
