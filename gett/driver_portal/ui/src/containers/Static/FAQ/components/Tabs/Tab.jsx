import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const Tab = (props) => {
  const isActive = () => {
    return props.isActive
  }

  return (
    <TabItem>
      <TabItemLink
        to={ `?tab=${props.tabIndex}` }
        isActive={ isActive }
        activeStyle={ { textDecoration: 'none', color: '#f6b530' } }
      >
        { props.label }
      </TabItemLink>
    </TabItem>
  )
}

const TabItem = styled.li`
  padding-bottom: 25px;
  margin-bottom: 25px;
  border-bottom: 1px solid rgba(192, 205, 218, 0.4);
  &:last-child {
    border: 0;
    padding-bottom: 0;
    margin-bottom: 0;
  }
`

const TabItemLink = styled(NavLink)`
  text-decoration: none;
  color: #000;
  cursor: pointer;
`

export default Tab
