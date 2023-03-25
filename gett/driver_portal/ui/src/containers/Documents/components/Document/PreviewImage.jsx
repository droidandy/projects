import React, { Component } from 'react'
import styled from 'styled-components'
import { media } from 'components/Media'

class PreviewImage extends Component {
  render() {
    const { file } = this.props
    return (
      <div>
        <Image src={ file } alt="error" />
      </div>
    )
  }
}

const Image = styled.img`
  max-width: 700px;
  display: block;
  vertical-align: top;
  
  ${media.phoneLarge`
     max-width: 40vh;
  `}
  
  ${media.phoneSmall`
     width: 100%;
  `}
`

export default PreviewImage
