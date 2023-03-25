import styled from 'styled-components';

export default styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color || 'white'};
  width: 195px;
  height: 38px;
  border: none;
  border-radius: 4px;
  font-size: 24px;
  font-weight: bold;
  background-color: ${props => props.backgroundColor || 'white'};
  margin-top: 5px;

  & > span.icon {
    margin-right: 10px;
  }
`;
