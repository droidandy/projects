import styled from 'styled-components'

const Button = styled.button`
  border: 0;
  width: 160px;
  height: 40px;
  border-radius: 4px;
  background-color: #f6b530;
  font-size: 14px;
  color: #000;
  cursor: pointer;

  &:disabled {
    color: #fff;
    background-color: #d2dadc;
    
    &:hover {
      background-color: #d2dadc;
    }
  }
  
  &:hover {
    background-color: #e1a62c;
  }
`

export default Button
