import React from 'react'
import styled from 'styled-components'

const Avatar = ({ width, height, className, user }) => {
  if (!user) {
    return null
  }

  return (
    user.avatarUrl ? (
      <Img width={ width } height={ height } className={ className } src={ user.avatarUrl } />
    ) : null
  )
}

Avatar.defaultProps = {
  width: 130,
  height: 130
}

const Img = styled.div`
    background-image: ${props => `url(${props.src})`};
    background-position: center;
    background-size: cover;
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    border-radius: ${props => props.width}px;
`

export default Avatar
