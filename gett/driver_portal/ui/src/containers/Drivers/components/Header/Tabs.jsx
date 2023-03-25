import React from 'react'
import styled from 'styled-components'

import { Tabs } from 'components/Tabs'

const TabsFilter = ({ onChange }) => (
  <Wrapper>
    <TabsStyled onChange={ onChange }>
      <Tab title="All" />
      <Tab title="Black cab" />
      <Tab title="Apollo" />
    </TabsStyled>
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-left: 25px;
`

const TabsStyled = styled(Tabs)`
  padding-right: 15px;
  padding-left: 15px;
`

const Tab = styled.div`
  padding: 0 15px;
`

export default TabsFilter
