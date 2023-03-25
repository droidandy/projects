import React from 'react'
import styled from 'styled-components'

const DropdownItem = ({ onClick, icon, label, children, className }) => (
  <Wrapper className={ className } onClick={ onClick }>
    { icon && <Icon>{ icon }</Icon> }
    { label || children }
  </Wrapper>
)

const Icon = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  padding: 10px 15px;

  &:hover {
    background-color: rgba(246, 181, 48, 0.2);
  }
`

export default DropdownItem
