import React from 'react'
import styled from 'styled-components'

const HistoryHeader = ({ title }) => (
  <Wrapper>
    <Title>
      { title }
    </Title>
    <Border />
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  align-items: center;
`

const Title = styled.div`
  font-size: 18px;
  font-weight: normal;
  color: #8794a0;
  width: 70%;
`

const Border = styled.div`
  height: 1px;
  background-color: #d8d8d8;
  margin-left: 20px;
  width: 30%;
`

export default HistoryHeader
