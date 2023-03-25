import React from 'react'
import styled from 'styled-components'

const Rate = ({ label, value = 0, Icon, className, prefix }) => {
  return <Wrapper className={ className }>
    <Label>
      <IconStyled>
        <Icon width="16" height="16" color="#6e7a87" />
      </IconStyled>
      {label}
    </Label>
    <ValueStyled>
      {value}{prefix}
    </ValueStyled>
  </Wrapper>
}

const Wrapper = styled.div`
  height: 60px;
  margin-top: 20px;
  border-radius: 4px;
  background-color: #f0f5fa;
  display: flex;
`

const Label = styled.div`
  align-self: center;
  display:flex;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.29;
  color: #282c37;
`

const IconStyled = styled.span`
  padding-right: 15px;
  padding-left: 15px;
`

const ValueStyled = styled.div`
  width: 60px;
  background-color: #4373d7;
  margin: 0 auto;
  margin-right: 0px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  vertical-align: middle;
  line-height: 60px;
`

export default Rate
