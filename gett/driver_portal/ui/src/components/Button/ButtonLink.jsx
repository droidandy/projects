import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const ButtonLink = props => <Button { ...props } />

ButtonLink.propTypes = {
  children: PropTypes.node,
  to: PropTypes.string,
  className: PropTypes.string
}

const Button = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  width: 160px;
  height: 40px;
  border-radius: 4px;
  background-color: #f6b530;
  font-size: 14px;
  color: #000;

  &:hover {
    background-color: #e1a62c;
  }
`

export default ButtonLink
